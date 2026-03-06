import type { Language, HistoryItem, TranslationChunk } from './types';

export const LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto-detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
];

export const MODELS = [
  { id: 'claude-sonnet', name: 'Claude Sonnet', quality: 'Best', costPer1k: 0.003 },
  { id: 'claude-opus', name: 'Claude Opus', quality: 'Premium', costPer1k: 0.015 },
  { id: 'gpt-4o', name: 'GPT-4o', quality: 'Great', costPer1k: 0.005 },
  { id: 'byok', name: 'Custom (BYOK)', quality: 'Custom', costPer1k: 0 },
];

export const STYLES = [
  { id: 'general', name: 'General', description: 'Natural, idiomatic translation' },
  { id: 'legal', name: 'Legal', description: 'Precise legal terminology' },
  { id: 'technical', name: 'Technical', description: 'Technical & scientific accuracy' },
  { id: 'medical', name: 'Medical', description: 'Clinical medical language' },
  { id: 'informal', name: 'Informal', description: 'Casual, conversational tone' },
];

export const MOCK_TRANSLATION_CHUNKS: TranslationChunk[] = [
  {
    index: 0,
    originalText: 'This Agreement is entered into as of the date last signed below (the "Effective Date") by and between GlobalTech Solutions Inc., a Delaware corporation ("Company"), and the party identified on the signature page ("Client").',
    translatedText: 'Il presente Accordo è stipulato alla data dell\'ultima firma indicata di seguito ("Data di Efficacia") tra GlobalTech Solutions Inc., una società del Delaware ("Società"), e la parte identificata nella pagina della firma ("Cliente").',
  },
  {
    index: 1,
    originalText: 'The Company agrees to provide software translation services as described in Schedule A attached hereto and incorporated herein by reference. All services shall be performed in a professional manner consistent with industry standards.',
    translatedText: 'La Società si impegna a fornire servizi di traduzione software come descritto nell\'Allegato A allegato al presente documento e incorporato nel medesimo per riferimento. Tutti i servizi saranno eseguiti in modo professionale e conforme agli standard del settore.',
  },
  {
    index: 2,
    originalText: 'Client shall pay Company the fees set forth in Schedule B. Payment is due within thirty (30) days of invoice. Late payments shall accrue interest at the rate of 1.5% per month.',
    translatedText: 'Il Cliente pagherà alla Società le tariffe stabilite nell\'Allegato B. Il pagamento è dovuto entro trenta (30) giorni dalla fattura. I pagamenti in ritardo matureranno interessi al tasso dell\'1,5% al mese.',
  },
  {
    index: 3,
    originalText: 'All intellectual property rights in the translated materials shall vest in Client upon receipt of full payment. Company retains no rights to use Client\'s proprietary information except as necessary to perform the services.',
    translatedText: 'Tutti i diritti di proprietà intellettuale sui materiali tradotti spetteranno al Cliente al momento della ricezione del pagamento completo. La Società non conserva alcun diritto di utilizzare le informazioni proprietarie del Cliente se non nella misura necessaria per la prestazione dei servizi.',
  },
  {
    index: 4,
    originalText: 'Either party may terminate this Agreement with thirty (30) days written notice. In the event of termination, Client shall pay for all work completed prior to the termination date.',
    translatedText: 'Ciascuna delle parti può risolvere il presente Accordo con un preavviso scritto di trenta (30) giorni. In caso di risoluzione, il Cliente dovrà pagare per tutto il lavoro completato prima della data di risoluzione.',
  },
  {
    index: 5,
    originalText: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.',
    translatedText: 'Il presente Accordo sarà disciplinato e interpretato in conformità con le leggi dello Stato del Delaware, senza riguardo alle sue disposizioni in materia di conflitti di legge.',
  },
  {
    index: 6,
    originalText: 'The parties agree that any disputes arising from this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.',
    translatedText: 'Le parti concordano che qualsiasi controversia derivante dal presente Accordo sarà risolta mediante arbitrato vincolante in conformità con le regole dell\'Associazione Americana di Arbitrato.',
  },
  {
    index: 7,
    originalText: 'This Agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior negotiations, representations, warranties, and agreements.',
    translatedText: 'Il presente Accordo costituisce l\'intero accordo tra le parti con riferimento al suo oggetto e sostituisce tutte le negoziazioni, rappresentazioni, garanzie e accordi precedenti.',
  },
];

export const MOCK_HISTORY: HistoryItem[] = [
  {
    jobId: 'job_001',
    fileName: 'contract_arabic.pdf',
    date: new Date('2025-01-15'),
    sourceLang: 'ar',
    targetLang: 'en',
    model: 'claude-sonnet',
    pages: 47,
    status: 'completed',
    cost: 0.14,
  },
  {
    jobId: 'job_002',
    fileName: 'research_paper_mandarin.docx',
    date: new Date('2025-01-14'),
    sourceLang: 'zh',
    targetLang: 'en',
    model: 'claude-opus',
    pages: 23,
    status: 'completed',
    cost: 0.35,
  },
  {
    jobId: 'job_003',
    fileName: 'product_manual_german.pdf',
    date: new Date('2025-01-12'),
    sourceLang: 'de',
    targetLang: 'en',
    model: 'claude-sonnet',
    pages: 112,
    status: 'completed',
    cost: 0.34,
  },
  {
    jobId: 'job_004',
    fileName: 'medical_report_french.pdf',
    date: new Date('2025-01-10'),
    sourceLang: 'fr',
    targetLang: 'en',
    model: 'gpt-4o',
    pages: 8,
    status: 'completed',
    cost: 0.04,
  },
  {
    jobId: 'job_005',
    fileName: 'legal_brief_spanish.docx',
    date: new Date('2025-01-08'),
    sourceLang: 'es',
    targetLang: 'en',
    model: 'claude-sonnet',
    pages: 34,
    status: 'completed',
    cost: 0.10,
  },
];

export function getLanguage(code: string): Language {
  return LANGUAGES.find(l => l.code === code) ?? { code, name: code.toUpperCase(), flag: '🌐' };
}

export function getModelName(id: string): string {
  return MODELS.find(m => m.id === id)?.name ?? id;
}
