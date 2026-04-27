import { SelectedSymptom } from "@/components/anatomy/symptom-list";

export interface DiagnosisResult {
    id: string;
    conditionName: string;
    probability: number; // 0 to 100
    overview: string;
    howCommon: string;
    symptomsList: string[];
    treatmentOptions: string[];
    urgency: "low" | "medium" | "high" | "critical";
    recommendation: string;
}

export async function analyzeSymptomsMock(symptoms: SelectedSymptom[]): Promise<DiagnosisResult[]> {
    // Simulate network and AI "thinking" time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    if (symptoms.length === 0) return [];

    const ids = symptoms.map(s => s.id);
    const has = (id: string) => ids.includes(id);

    let results: DiagnosisResult[] = [];

    // --- URGENCES VITALES (CRITICAL/HIGH URGENCY) ---
    if (has("chest_pain_heavy")) {
        results.push({
            id: "d_infarctus",
            conditionName: "Infarctus du Myocarde (Crise Cardiaque)",
            probability: has("breath_short") || has("arm_numbness") ? 95 : 70,
            overview: "Obstruction d'une artère coronaire privant le cœur d'oxygène. C'est une urgence vitale absolue.",
            howCommon: "Très fréquent en Tunisie chez les fumeurs, diabétiques et hypertendus.",
            symptomsList: ["Douleur thoracique oppressive (en étau)", "Irradiation mâchoire/bras gauche", "Sueurs froides", "Angoisse"],
            treatmentOptions: ["Appel SAMU 190", "Aspirine (si non allergique)", "Angioplastie hospitalière"],
            urgency: "critical",
            recommendation: "Appelez le 190 immédiatement. Ne faites aucun effort."
        });
    }

    if (has("confusion") || has("vision_loss") || has("arm_weakness")) {
        results.push({
            id: "d_avc",
            conditionName: "AVC (Accident Vasculaire Cérébral)",
            probability: 90,
            overview: "Interruption brutale de l'irrigation sanguine du cerveau (caillot ou hémorragie).",
            howCommon: "Une des premières causes de handicap en Tunisie.",
            symptomsList: ["Visage déformé", "Incapacité à lever un bras", "Troubles de la parole", "Perte de vision"],
            treatmentOptions: ["Hospitalisation en unité neuro-vasculaire", "Thrombolyse (si < 4h30)", "Rééducation"],
            urgency: "critical",
            recommendation: "VITE : Visage, Inertie, Trouble de la parole, En urgence. Appelez le 190."
        });
    }

    if (has("leg_swelling")) {
        results.push({
            id: "d_phlebite",
            conditionName: "Thrombose Veineuse Profonde (Phlébite)",
            probability: 80,
            overview: "Formation d'un caillot de sang dans une veine profonde de la jambe.",
            howCommon: "Risque accru après voyage long, chirurgie ou alitement prolongé.",
            symptomsList: ["Mollet gonflé, rouge et chaud", "Douleur à la marche", "Douleur à la dorsiflexion du pied"],
            treatmentOptions: ["Anticoagulants (Héparine)", "Bas de contention", "Échodoppler d'urgence"],
            urgency: "high",
            recommendation: "Consultez aux urgences pour éviter une embolie pulmonaire."
        });
    }

    if (has("right_lower_pain")) {
        results.push({
            id: "d_appendicitis",
            conditionName: "Appendicite Aiguë",
            probability: has("nausea_vomit") || has("fever") ? 88 : 55,
            overview: "Inflammation de l'appendice iléo-cæcal.",
            howCommon: "Urgences chirurgicale la plus fréquente.",
            symptomsList: ["Douleur fosse iliaque droite", "Défense abdominale", "Nausées", "Légère fièvre"],
            treatmentOptions: ["Appendicectomie", "Antibiotiques"],
            urgency: "high",
            recommendation: "Restez à jeun et consultez un chirurgien d'urgence."
        });
    }

    // --- MALADIES CHRONIQUES & SYSTÉMIQUES ---
    if (has("thirst_excessive") || has("urinary_freq")) {
        results.push({
            id: "d_diabetes",
            conditionName: "Diabète de type 2 (Débutant)",
            probability: has("fatigue_chronic") || has("vision_blur") ? 85 : 50,
            overview: "Excès de sucre dans le sang dû à une mauvaise utilisation de l'insuline par l'organisme.",
            howCommon: "Touche plus de 15% de la population adulte en Tunisie.",
            symptomsList: ["Soif intense", "Envies d'uriner fréquentes", "Fatigue", "Cicatrisation lente"],
            treatmentOptions: ["Régime alimentaire adapté", "Activité physique", "Antidiabétiques oraux (Metformine)"],
            urgency: "medium",
            recommendation: "Réalisez une glycémie à jeun en laboratoire dès demain."
        });
    }

    // --- MALADIES LOCALES / RÉGIONALES ---
    if (has("fever_chills") || has("raw_milk_consumption")) {
        results.push({
            id: "d_brucellosis",
            conditionName: "Brucellose (Fièvre de Malte)",
            probability: 75,
            overview: "Infection transmise par le lait cru ou le contact animal.",
            howCommon: "Endémique dans les régions rurales tunisiennes.",
            symptomsList: ["Fièvre ondulante", "Douleurs articulaires", "Sueurs nocturnes"],
            treatmentOptions: ["Doxycycline + Rifampicine pendant 6 semaines"],
            urgency: "medium",
            recommendation: "Parlez à votre médecin de votre consommation de produits laitiers artisanaux."
        });
    }

    if (has("stomach_burn") || has("nausea_vomit")) {
        results.push({
            id: "d_gastritis",
            conditionName: "Gastrite / Reflux Gastro-Œsophagien (RGO)",
            probability: 90,
            overview: "Inflammation de la muqueuse de l'estomac ou remontée d'acide vers l'œsophage.",
            howCommon: "Très fréquent, aggravé par le stress, les épices et le café.",
            symptomsList: ["Brûlures derrière le sternum", "Régurgitations acides", "Douleurs après les repas"],
            treatmentOptions: ["Antiacides (Gaviscon)", "IPP (Inexium)", "Hygiène alimentaire"],
            urgency: "low",
            recommendation: "Évitez les repas copieux avant de dormir et réduisez les excitants."
        });
    }

    // --- FALLBACK SI AUCUNE CORRESPONDANCE SPÉCIFIQUE ---
    if (results.length === 0) {
        results.push({
            id: "d_generic_viral",
            conditionName: "Syndrome Viral / Bilan Médical Requis",
            probability: 45,
            overview: "Vos symptômes sont diffus et peuvent correspondre à une multitude d'états viraux bénins ou à une fatigue générale passagère.",
            howCommon: "Très fréquent.",
            symptomsList: ["Fatigue inexpliquée", "Symptômes isolés ou vagues"],
            treatmentOptions: [
                "Repos",
                "Hydratation abondante",
                "Paracétamol en cas d'inconfort ou de légère fièvre"
            ],
            urgency: "low",
            recommendation: "Il est conseillé d'observer l'évolution de vos symptômes. Si la gêne persiste au-delà de 48 heures, veuillez consulter un médecin généraliste."
        });
    }

    // Sort by probability (descending)
    return results.sort((a, b) => b.probability - a.probability);
}
