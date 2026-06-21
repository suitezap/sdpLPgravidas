/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Baby, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown, 
  Award, 
  FileText, 
  HeartHandshake, 
  DollarSign, 
  Star,
  Users,
  Building,
  Briefcase,
  HelpCircle,
  Menu,
  X,
  FileHeart,
  BriefcaseBusiness,
  TrendingUp,
  Coins,
  MapPin,
  CalendarDays,
  Send,
  Sparkles
} from 'lucide-react';

// Types for Simulator State
type SimCurrentState = 'PREGNANT' | 'BORN' | 'ABORTION' | null;
type SimEmploymentType = 'CLT' | 'AUTONOMOUS' | 'UNEMPLOYED' | 'INFORMAL' | null;
type SimFiredStatus = 'FIRED_NO_CAUSE' | 'FORCED_RESIGN' | 'WORKING_NORMAL' | 'CONTRACT_ENDED' | null;

interface Testimonial {
  name: string;
  location: string;
  text: string;
  benefit: string;
  tag: string;
  rating: number;
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab2] = useState('all');
  
  // Lead Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('advocacia_leads');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    mensagem: '',
    termoConsentimento: false,
  });

  // Simulator State
  const [simStep, setSimStep] = useState(1);
  const [simState, setSimState] = useState<SimCurrentState>(null);
  const [simEmployment, setSimEmployment] = useState<SimEmploymentType>(null);
  const [simFired, setSimFired] = useState<SimFiredStatus>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  // FAQ Active Index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Testimonials list
  const testimonials: Testimonial[] = [
    {
      name: "Mariana Silva de Souza",
      location: "São Paulo - SP",
      benefit: "Salário Maternidade e Estabilidade Gestacional",
      tag: "Indenização Conquistada",
      rating: 5,
      text: "Fui demitida grávida de 3 meses em contrato de experiência e me disseram que eu não tinha direitos. Graças à equipe do Seu Direito Prime, conseguimos provar na Justiça do Trabalho que a estabilidade é garantida por lei e recebi toda a indenização do período correspondente mais o salário maternidade. Atendimento extremamente acolhedor e profissional."
    },
    {
      name: "Sabrina Alencar Viana",
      location: "Belo Horizonte - MG",
      benefit: "Salário Maternidade pelo INSS (Desempregada)",
      tag: "Benefício Maternidade Conquistado",
      rating: 5,
      text: "Estava desempregada há 5 meses quando tive minha filha e o INSS negou meu benefício alegando perda de qualidade de segurada. A equipe de especialistas fez uma análise cirúrgica e entrou com pedido de forma muito ágil. Recebi acumulado direto do INSS. Excelente trabalho!"
    },
    {
      name: "Karina Mendes Albuquerque",
      location: "Campinas - SP",
      benefit: "Estabilidade Gestacional e Danos Morais",
      tag: "Indenização Conquistada",
      rating: 5,
      text: "Eu sofria muita pressão psicológica no trabalho após contar que estava grávida. Me forçaram a pedir demissão. Fui acolhida de forma muito humana pela equipe. Conseguimos a reversão judicial para demissão sem justa causa e indenização por assédio moral. Transparência total!"
    }
  ];

  // FAQ Items
  const faqItems = [
    {
      question: "Fui demitida grávida durante o período de experiência ou contrato temporário. Tenho direitos?",
      answer: "Sim, absolutamente! A jurisprudência brasileira (Súmula 244, III do TST) garante a estabilidade provisória da gestante mesmo em contratos de experiência, de prazo determinado ou temporários. O empregador não pode rescindir seu contrato sem arcar com a indenização substitutiva integral correspondente do início da gravidez até 5 meses após o parto."
    },
    {
      question: "Estou desempregada. Ainda assim posso requerer o Salário Maternidade?",
      answer: "Sim! Mulheres desempregadas têm direito ao Salário-Maternidade pago diretamente pelo INSS, desde que mantida a 'qualidade de segurada' no momento do parto ou adoção. Isso significa que você precisa estar dentro do 'período de graça' (geralmente entre 12 e 36 meses após o último emprego pago ou contribuição). Analisamos seu extrato do CNIS minuciosamente para garantir essa liberação."
    },
    {
      question: "Descobri a gravidez após ter sido demitida. Ainda tenho direito à estabilidade?",
      answer: "Sim! O fator determinante para a estabilidade é a concepção ter ocorrido durante a vigência do contrato de trabalho (mesmo se durante o aviso prévio trabalhado ou indenizado). Não importa se você descobriu apenas semanas depois de sair: a empresa é legalmente responsável por te reintegrar ou pagar a devida indenização financeira substitutiva."
    },
    {
      question: "O INSS negou meu Salário-Maternidade. O que devo fazer?",
      answer: "Infelizmente, o INSS comete inúmeros indeferimentos injustos, especialmente para trabalhadoras autônomas, desempregadas, empregadas domésticas ou trabalhadoras rurais. Nós atuamos de forma imediata ingressando com recursos administrativos urgentes ou ações judiciais com pedidos de liminar para que você não fique desamparada e receba o valor com correções e juros."
    },
    {
      question: "Quais são os honorários cobrados pelo escritório?",
      answer: "Nós atuamos no modelo de honorários 'ad exitum' para ações trabalhistas e previdenciárias de maternidade, o que significa que o nosso cliente só paga uma porcentagem dos valores de fato recuperados ao final do processo, se obtivermos vitória. Isso garante que você não precise de capital inicial para iniciar sua busca pela justiça trabalhista."
    }
  ];

  // Simulator Reset
  const handleResetSimulator = () => {
    setSimStep(1);
    setSimState(null);
    setSimEmployment(null);
    setSimFired(null);
    setIsSimulated(false);
  };

  // Handle Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp || !formData.email || !formData.termoConsentimento) {
      alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API storage with lazy checkout/save
    setTimeout(() => {
      const newLead = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toLocaleDateString('pt-BR'),
        simulation: {
          step: simStep,
          state: simState,
          employment: simEmployment,
          fired: simFired,
        }
      };

      const updatedHistory = [newLead, ...submissionHistory].slice(0, 10);
      setSubmissionHistory(updatedHistory);
      try {
        localStorage.setItem('advocacia_leads', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error(err);
      }
      
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // Auto reset form fields
      setFormData({
        nome: '',
        whatsapp: '',
        email: '',
        mensagem: '',
        termoConsentimento: false,
      });
    }, 1500);
  };

  // Generate WhatsApp message based on Simulator results
  const getWhatsAppLink = () => {
    const phoneNumber = "5511991217290"; // Representative active WhatsApp number
    let diagnostic = "Gostaria de agendar uma consulta para avaliar os meus direitos de maternidade/trabalhista.";
    
    if (isSimulated) {
      diagnostic = `Fiz a simulação virtual no site: Estágio: ${simState === 'PREGNANT' ? 'Gestante' : simState === 'BORN' ? 'Pós-parto' : 'Gestação Interrompida'}. Vínculo: ${simEmployment}. Status: ${simFired}.`;
    }
    
    const text = encodeURIComponent(`Olá, Seu Direito Prime. ${diagnostic} Gostaria de uma análise detalhada e urgente do meu caso para garantir meus direitos.`);
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
  };

  // Diagnostic Result generator for simulator
  const getDiagnostic = () => {
    if (simState === 'PREGNANT' && simEmployment === 'CLT' && (simFired === 'FIRED_NO_CAUSE' || simFired === 'CONTRACT_ENDED')) {
      return {
        title: "Urgente: Indicação de Demissão Totalmente Ilegal",
        severity: "critical",
        score: "98% de chance de êxito",
        description: "Seu caso aponta para estabilidade provisória estrita. Grávidas não podem ser demitidas sem justa causa, mesmo em contratos temporários ou de experiência. Você tem direito à reintegração ou à indenização integral de todos os salários que receberia até 5 meses após o parto.",
        recomenda: "Ingressar com Ação Trabalhista com pedido liminar urgente para indenização protetiva ou reintegração integral."
      };
    }
    
    if (simState === 'PREGNANT' && simEmployment === 'CLT' && simFired === 'FORCED_RESIGN') {
      return {
        title: "Alerta: Indícios de Rescisão de Contrato Indireta por Coação",
        severity: "warning",
        score: "90% de chance de êxito",
        description: "O pedido de demissão assinado sob assédio ou coação moral pode ser revertido judicialmente. Pela gravidade, sua estabilidade gestacional permanece amparada legalmente. A lei protege as mães contra ambientes hostis.",
        recomenda: "Ação de reversão de pedido de demissão em dispensa sem justa causa com reintegração e danos morais."
      };
    }

    if (simState === 'ABORTION' && simEmployment === 'CLT') {
      return {
        title: "Garantias de Repouso e Estabilidade por Interrupção de Gestação",
        severity: "attention",
        score: "95% de chance de êxito",
        description: "A CLT protege mulheres que passam por interrupção de gestação. Em caso de aborto não criminoso comprovado, assiste-lhe o repouso remunerado de 2 semanas de afastamento e estabilidade no trabalho.",
        recomenda: "Garantir a licença médica obrigatória e assegurar que a empresa não proceda com rescisões indevidas."
      };
    }

    if (simEmployment === 'UNEMPLOYED' || simEmployment === 'AUTONOMOUS') {
      return {
        title: "Análise de Direito Preservado de Salário-Maternidade",
        severity: "success",
        score: "85% de chance de êxito",
        description: "Mesmo desempregada ou trabalhando de forma autônoma/individual, você pode obter os 4 meses de Salário-Maternidade pagos pelo INSS. Avaliaremos se seu 'período de graça' de contribuição continua ativo para que o INSS libere o pagamento.",
        recomenda: "Requerer administrativamente ou por via judicial contra o INSS com cálculo detalhado de CNIS."
      };
    }

    if (simEmployment === 'INFORMAL') {
      return {
        title: "Alerta: Direito ao Reconhecimento de Vínculo Trabalhista Oculto",
        severity: "critical",
        score: "88% de chance de êxito",
        description: "O trabalho informal sem carteira assinada, mas com subordinação e regularidade, configura fraude à CLT. Você tem direito a registrar a carteira retroativamente e receber os 120 dias de auxílio-maternidade pagos pelo empregador, além de estabilidade.",
        recomenda: "Ajuizar Ação de Reconhecimento de Vínculo de Emprego com pedido de indenização de gestação acumulada."
      };
    }

    return {
      title: "Análise de Direitos de Maternidade Padrão",
      severity: "success",
      score: "Análise Geral",
      description: "Você possui direitos assegurados de licença de 120 dias e estabilidade do emprego. Iremos verificar se há qualquer negligência da empresa ou do INSS no seu pagamento contratual.",
      recomenda: "Realizar uma consulta jurídica gratuita de 30 minutos com nossa mentora jurídica especializada."
    };
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 selection:bg-[#b5924d] selection:text-white font-sans antialiased">
      
      {/* BACKGROUND GLOW DECORATIONS */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#b5924d]/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#b5924d]/2 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#b5924d]/1 blur-[100px] pointer-events-none z-0" />

      {/* HEADER SECTION (NATIVE GLASSMORPHISM - LIGHT PRESTIGE) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF8F5]/85 border-b border-[#b5924d]/10 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Typographic Elegant Logo */}
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#b5924d] flex items-center justify-center shadow-md shadow-[#b5924d]/10 group-hover:scale-105 transition-transform duration-300">
              <Scale className="w-5.5 h-5.5 text-white stroke-[2]" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider font-bold text-[#132238] uppercase block leading-none">
                Seu Direito
              </span>
              <span className="text-[11px] tracking-[0.2em] text-[#b5924d] uppercase font-black mt-1 block">
                Prime
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <a href="#diferenciais" className="text-slate-600 hover:text-[#b5924d] transition-colors duration-200">Diferenciais</a>
            <a href="#simulador" className="text-slate-600 hover:text-[#b5924d] transition-colors duration-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b5924d]" />
              Simulador de Direitos
            </a>
            <a href="#sobre" className="text-slate-600 hover:text-[#b5924d] transition-colors duration-200">Sobre o Escritório</a>
            <a href="#depoimentos" className="text-slate-600 hover:text-[#b5924d] transition-colors duration-200">Depoimentos</a>
            <a href="#contato" className="text-slate-600 hover:text-[#b5924d] transition-colors duration-200">FAQ & Contato</a>
          </nav>

          {/* Desktop Contact CTA Button with scale pulse */}
          <div className="hidden md:block">
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-transparent border-2 border-[#b5924d] text-[#b5924d] hover:bg-[#b5924d] hover:text-white transition-all duration-300 flex items-center gap-2 glow-btn-pulse cursor-pointer"
              id="cta_header"
            >
              <Phone className="w-3.5 h-3.5" />
              Consulta Urgente
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-[#b5924d] focus:outline-none py-1 px-2 cursor-pointer"
            aria-label="Menu"
            id="mobile_menu_toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FAF8F5]/98 backdrop-blur-lg border-t border-[#b5924d]/10"
            >
              <div className="px-6 py-6 space-y-4 flex flex-col">
                <a 
                  href="#diferenciais" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-[#b5924d] text-base font-semibold py-2 border-b border-slate-200/60"
                >
                  Diferenciais
                </a>
                <a 
                  href="#simulador" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-[#b5924d] text-base font-semibold py-2 border-b border-slate-200/60 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#b5924d]" />
                  Simulador de Direitos
                </a>
                <a 
                  href="#sobre" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-[#b5924d] text-base font-semibold py-2 border-b border-slate-200/60"
                >
                  Sobre o Escritório
                </a>
                <a 
                  href="#depoimentos" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-[#b5924d] text-base font-semibold py-2 border-b border-slate-200/60"
                >
                  Depoimentos
                </a>
                <a 
                  href="#contato" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-[#b5924d] text-base font-semibold py-2 border-b border-slate-200/60"
                >
                  FAQ & Contato
                </a>
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full py-3 bg-[#b5924d] text-white text-center rounded-lg text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Chamar no WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <section id="hero" className="relative pt-10 pb-20 md:py-32 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b5924d]/10 border border-[#b5924d]/20 text-[#b5924d] text-xs font-semibold uppercase tracking-wider mb-6 self-start">
              <Baby className="w-3.5 h-3.5" />
              Defesa Exclusiva de Gestantes e Mães
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#132238] mb-6 leading-[1.1] font-bold">
              Proteção Jurídica Máxima no Momento Mais Importante da Sua Vida
            </h1>

            <p className="text-slate-600 text-lg md:text-xl mb-10 leading-relaxed font-light">
              Garantimos seu <strong className="text-[#132238] font-semibold">Salário-Maternidade</strong> integral e combatemos a demissão ilegal de grávidas com atuação estratégica, ágil e acolhimento humano. Sem falar difícil ou juridiquês.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#simulador"
                className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#c5a059] to-[#b5924d] text-white hover:opacity-95 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#b5924d]/20 glow-btn-pulse cursor-pointer"
                id="hero_primary_cta"
              >
                <Sparkles className="w-4 h-4" />
                Simular Meus Direitos
              </a>
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-[#b5924d]/50 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                id="hero_secondary_cta"
              >
                <MessageCircle className="w-4 h-4 text-[#b5924d]" />
                Falar com Especialista
              </a>
            </div>

            {/* Bullet List of Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#b5924d] flex-shrink-0" />
                <span>Atuação em todo território nacional</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#b5924d] flex-shrink-0" />
                <span>Trabalhamos no formato Êxito (só cobramos ao ganhar)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#b5924d] flex-shrink-0" />
                <span>Derrubamos indeferimentos injustos do INSS</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#b5924d] flex-shrink-0" />
                <span>Especialistas dedicadas com zelo impecável</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Visual Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#b5924d]/15 bg-white p-3 shadow-2xl">
              {/* Overlay shadow lines */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/40 via-transparent to-transparent z-10 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=700" 
                alt="Mãe grávida em momento profissional e afetuoso" 
                className="w-full h-[320px] sm:h-[420px] object-cover rounded-xl transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Highlight Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 z-20 backdrop-blur-md bg-white/95 border border-[#b5924d]/25 p-5 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#b5924d]/10 rounded-lg text-[#b5924d] flex-shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#132238] text-base font-semibold leading-tight">Seu Direito Prime</h4>
                    <p className="text-xs text-[#b5924d] tracking-wider uppercase mt-1 mb-2 font-medium">Defesa Jurídica Especializada</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-light">"Nossa missão é garantir que o momento mais especial da sua vida não seja maculado pelo descaso ou perda de seus legítimos direitos."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aesthetic badge decoration */}
            <div className="absolute -top-4 -right-4 bg-white border border-[#b5924d]/30 p-4 rounded-xl shadow-xl hidden sm:flex items-center gap-3 z-30">
              <div className="text-3xl font-serif text-[#b5924d] font-bold">100%</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-600 font-medium leading-normal">Foco no Bem-Estar <br />da Trabalhadora</div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* COMMITMENT & VALUES SECTION (REPLACES STATS BAR PER REQUEST) */}
      <section className="bg-gradient-to-br from-[#f5f2eb]/70 to-[#eae5db]/50 border-y border-[#b5924d]/20 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Atendimento Personalizado */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl hover:bg-[#FAF8F5]/60 transition-all border border-transparent hover:border-[#b5924d]/15">
            <div className="p-3 bg-[#b5924d]/10 rounded-lg text-[#b5924d] flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-[#132238] font-bold text-lg mb-2">Atendimento Personalizado</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Cada cliente é único, e sua solução jurídica é construída com a atenção e o foco que seu caso demanda.
              </p>
            </div>
          </div>

          {/* Comunicação Transparente */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl hover:bg-[#FAF8F5]/60 transition-all border border-transparent hover:border-[#b5924d]/15 md:border-l md:border-l-[#b5924d]/15">
            <div className="p-3 bg-[#b5924d]/10 rounded-lg text-[#b5924d] flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-[#132238] font-bold text-lg mb-2">Comunicação Transparente</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Cada etapa do seu processo explicada com clareza, sem surpresas e sem juridiquês.
              </p>
            </div>
          </div>

          {/* Honorários Justos */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl hover:bg-[#FAF8F5]/60 transition-all border border-transparent hover:border-[#b5924d]/15 md:border-l md:border-l-[#b5924d]/15">
            <div className="p-3 bg-[#b5924d]/10 rounded-lg text-[#b5924d] flex-shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-[#132238] font-bold text-lg mb-2">Honorários Justos</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Resultados eficientes, valores acessíveis e investimento claro, sem letras miúdas e sem complicações.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* DIFFERENTIALS SECTION (BENTO GRID STYLE WITH LIGHT CORPORATE THEME) */}
      <section id="diferenciais" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-16">
          <span className="text-[#b5924d] text-xs font-semibold uppercase tracking-widest block mb-3">Atuação de Alta Performance</span>
          <h2 className="font-serif text-3.5xl md:text-5xl text-[#132238] tracking-tight leading-tight font-bold">
            Por que somos diferentes de escritórios genéricos?
          </h2>
          <p className="text-slate-600 mt-4 max-w-2xl font-light text-base md:text-lg">
            Nossa dedicação é inteiramente voltada ao universo trabalhista materno e previdenciário do salário maternidade. Agimos onde a burocracia desiste.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Main Differential (Size: 8 cols on md) */}
          <div className="md:col-span-8 bg-white border border-[#b5924d]/15 p-8 rounded-2xl flex flex-col justify-between group hover:border-[#b5924d]/45 transition-all duration-300 relative overflow-hidden min-h-[280px] shadow-sm shadow-slate-100">
            <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-[#b5924d]/5 rounded-full blur-3xl group-hover:bg-[#b5924d]/10 transition-colors duration-300" />
            <div>
              <div className="p-3 bg-[#b5924d]/10 inline-block rounded-xl text-[#b5924d] mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#132238] font-semibold mb-3">Atuação Estratégica e Foco Exclusivo no Resultado</h3>
              <p className="text-slate-600 font-light text-base leading-relaxed max-w-xl">
                Não somos generalistas. Nossa equipe estuda diariamente as nuances e decisões dos tribunais superiores trabalhistas sobre proteção à gestante e salário-maternidade. Desenhamos a melhor tese para reverter demissões disfarçadas e indenizar danos morais.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b5924d] group-hover:translate-x-1.5 transition-transform duration-300">
              <span>Sua estabilidade resguardada</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Transparency & Clear communication (Size: 4 cols on md) */}
          <div className="md:col-span-4 bg-white border border-[#b5924d]/15 p-8 rounded-2xl flex flex-col justify-between group hover:border-[#b5924d]/45 transition-all duration-300 relative overflow-hidden shadow-sm shadow-slate-100">
            <div>
              <div className="p-3 bg-[#b5924d]/10 inline-block rounded-xl text-[#b5924d] mb-6">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl text-[#132238] font-semibold mb-3">Sem Juridiquês ou Falar Difícil</h3>
              <p className="text-slate-600 font-light text-sm leading-relaxed">
                Relatamos o andamento do seu processo diretamente no WhatsApp de forma rápida, simples e transparente. Você sabe os riscos, avanços e prazos reais do seu amparo legal.
              </p>
            </div>
            <div className="mt-8 text-xs font-semibold uppercase tracking-wider text-[#b5924d]">
              Comunicação empática
            </div>
          </div>

          {/* Card 3: Free Consultation / Agility (Size: 4 cols on md) */}
          <div className="md:col-span-4 bg-white border border-[#b5924d]/15 p-8 rounded-2xl flex flex-col justify-between group hover:border-[#b5924d]/45 transition-all duration-300 relative overflow-hidden shadow-sm shadow-slate-100">
            <div>
              <div className="p-3 bg-[#b5924d]/10 inline-block rounded-xl text-[#b5924d] mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl text-[#132238] font-semibold mb-3">Atendimento Ágil com Emergência</h3>
              <p className="text-slate-600 font-light text-sm leading-relaxed">
                Entendemos que mães gestantes ou recentes não podem se dar ao luxo de esperar. Oferecemos diagnósticos completos em menos de 24 horas úteis, poupando seu tempo precioso.
              </p>
            </div>
            <div className="mt-8 text-xs font-semibold uppercase tracking-wider text-[#b5924d]">
              Resposta em até 24h
            </div>
          </div>

          {/* Card 4: Analysis of Risks / Zero Cost Upfront (Size: 8 cols on md) */}
          <div className="md:col-span-8 bg-white border border-[#b5924d]/15 p-8 rounded-2xl flex flex-col justify-between group hover:border-[#b5924d]/45 transition-all duration-300 relative overflow-hidden min-h-[280px] shadow-sm shadow-slate-100">
            <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-[#b5924d]/5 rounded-full blur-3xl group-hover:bg-[#b5924d]/10 transition-colors duration-300" />
            <div>
              <div className="p-3 bg-[#b5924d]/10 inline-block rounded-xl text-[#b5924d] mb-6">
                <FileCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#132238] font-semibold mb-3">Análise Detalhada Baseada em Provas</h3>
              <p className="text-slate-600 font-light text-base leading-relaxed max-w-xl">
                Nenhuma ação é aberta sem análise exaustiva. Validamos o CNIS, conversas de WhatsApp com a chefia, atestados de gravidez, exames de ultrassom e registros internos da empresa para blindar seu pedido e reduzir qualquer risco processual.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b5924d] group-hover:translate-x-1.5 transition-transform duration-300">
              <span>Transparência e segurança jurídica total</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* SHADED SPLIT / CTA LINE */}
      <section className="py-6 text-center border-t border-slate-150">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#b5924d] text-sm tracking-wide font-medium">
            ✔ Análise de risco estratégica no início &nbsp;•&nbsp; ✔ Rigor nos cálculos de indenização &nbsp;•&nbsp; ✔ Suporte humanizado
          </p>
        </div>
      </section>

      {/* INTERACTIVE COMPREHENSIVE SIMULATOR SECTION - LIGHT CORPORATE */}
      <section id="simulador" className="py-24 px-6 bg-[#FBF9F6] border-y border-slate-200/60 relative overflow-hidden">
        
        {/* Subtle decorative gold glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#b5924d]/4 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-[#b5924d] text-xs font-semibold uppercase tracking-widest block mb-3">
              Tecnologia & Praticidade
            </span>
            <h2 className="font-serif text-3xl sm:text-4.5xl text-[#132238] tracking-tight font-bold">
              Simulador de Direitos de Maternidade
            </h2>
            <p className="text-slate-600 mt-4 max-w-xl mx-auto font-light leading-relaxed">
              Responda a 3 perguntas simples e receba um diagnóstico especializado instantâneo das suas garantias financeiras e de estabilidade.
            </p>
          </div>

          {/* Interactive noble card box */}
          <div className="bg-white border border-[#b5924d]/15 p-8 md:p-12 rounded-2xl shadow-xl shadow-slate-100/80">
            
            {/* Step Indicators */}
            {!isSimulated && (
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200/80 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${simStep >= 1 ? 'bg-[#b5924d] text-white' : 'bg-slate-150 text-slate-400'}`}>1</div>
                  <span className={simStep === 1 ? 'text-[#132238] font-bold' : 'text-slate-400 font-light'}>Estágio Matinal</span>
                </div>
                <div className="w-12 h-[1px] bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${simStep >= 2 ? 'bg-[#b5924d] text-white' : 'bg-slate-150 text-slate-400'}`}>2</div>
                  <span className={simStep === 2 ? 'text-[#132238] font-bold' : 'text-slate-400 font-light'}>Vínculo de Trabalho</span>
                </div>
                <div className="w-12 h-[1px] bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${simStep >= 3 ? 'bg-[#b5924d] text-white' : 'bg-slate-150 text-slate-400'}`}>3</div>
                  <span className={simStep === 3 ? 'text-[#132238] font-bold' : 'text-slate-400 font-light'}>Situação Ocupacional</span>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 1: CURRENT MATERNITY STATE */}
              {simStep === 1 && !isSimulated && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-xl sm:text-2xl text-[#132238] font-semibold text-center mb-8">
                    Qual é o seu estágio ou situação de maternidade atual?
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => { setSimState('PREGNANT'); setSimStep(2); }}
                      className="p-6 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-center transition-all group flex flex-col items-center gap-4 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Baby className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] mb-1">Estou gestante</span>
                        <span className="text-xs text-slate-500 font-light">Em qualquer mês da gravidez atualmente</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimState('BORN'); setSimStep(2); }}
                      className="p-6 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-center transition-all group flex flex-col items-center gap-4 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HeartHandshake className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] mb-1">Meu bebê já nasceu</span>
                        <span className="text-xs text-slate-500 font-light">Bebês nascidos recentemente ou adotados</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimState('ABORTION'); setSimStep(2); }}
                      className="p-6 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-center transition-all group flex flex-col items-center gap-4 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileHeart className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] mb-1">Gestação interrompida</span>
                        <span className="text-xs text-slate-500 font-light">Aborto espontâneo ou parto natimorto</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: EMPLOYMENT SYSTEM */}
              {simStep === 2 && !isSimulated && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-xl sm:text-2xl text-[#132238] font-semibold text-center mb-8">
                    Qual era/é o seu vínculo de trabalho principal?
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setSimEmployment('CLT'); setSimStep(3); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">CLT (Carteira assinada)</span>
                        <span className="text-xs text-slate-500">Inclui contratos de experiência ou trabalho temporário</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimEmployment('AUTONOMOUS'); setSimStep(3); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Autônoma / Contribuinte MEI</span>
                        <span className="text-xs text-slate-500">Pagamentos com Carnê do INSS ou guia simplificada</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimEmployment('UNEMPLOYED'); setSimStep(3); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Sem Emprego (Desempregada)</span>
                        <span className="text-xs text-slate-500">Não estou registrada hoje, mas já contribuí anteriormente</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimEmployment('INFORMAL'); setSimStep(3); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Trabalho Sem Registro (Informal)</span>
                        <span className="text-xs text-slate-500">Empregada sem assinatura, mas com rotina patronal</span>
                      </div>
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <button 
                      onClick={() => setSimStep(1)}
                      className="text-slate-550 hover:text-[#b5924d] text-xs underline font-medium transition-colors"
                    >
                      ← Voltar ao início
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DISMISSAL / JOB SITUATION */}
              {simStep === 3 && !isSimulated && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-xl sm:text-2xl text-[#132238] font-semibold text-center mb-8">
                    Houve alguma alteração no seu emprego recentemente?
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setSimFired('FIRED_NO_CAUSE'); setIsSimulated(true); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <BriefcaseBusiness className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Fui demitida sem justa causa</span>
                        <span className="text-xs text-slate-500">Pelo empregador de forma direta ou aviso prévio</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimFired('FORCED_RESIGN'); setIsSimulated(true); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Me forçaram a pedir demissão</span>
                        <span className="text-xs text-slate-500">Assédio, pressões ou coação patronal extrema</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimFired('CONTRACT_ENDED'); setIsSimulated(true); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Prazo de contrato encerrou</span>
                        <span className="text-xs text-slate-500">Contrato temporário, gravidez durante experiência</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSimFired('WORKING_NORMAL'); setIsSimulated(true); }}
                      className="p-5 bg-[#FAF8F5]/60 border border-slate-200 hover:border-[#b5924d]/50 hover:bg-white rounded-xl text-left transition-all group flex items-center gap-4 cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-[#132238] text-sm">Continuo trabalhando normalmente</span>
                        <span className="text-xs text-slate-500">Empresa sabe (ou não sabe) do meu estado de saúde</span>
                      </div>
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button 
                      onClick={() => setSimStep(2)}
                      className="text-slate-500 hover:text-[#b5924d] text-xs underline font-medium transition-colors"
                    >
                      ← Voltar à pergunta anterior
                    </button>
                    <button 
                      onClick={handleResetSimulator}
                      className="text-[#b5924d]/85 hover:text-[#b5924d] text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Recomeçar simulador
                    </button>
                  </div>
                </motion.div>
              )}

              {/* DIAGNOSTIC RESULTS DISPLAY PAGE */}
              {isSimulated && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-4">
                    <h3 className="font-serif text-2xl text-[#132238] font-semibold flex items-center gap-2">
                      <Award className="w-6 h-6 text-[#b5924d]" />
                      Análise Jurídica Preliminar do Caso
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-[#b5924d]/10 border border-[#b5924d]/30 text-[#b5924d] text-xs font-semibold tracking-wider">
                      {getDiagnostic().score}
                    </span>
                  </div>

                  {/* Diagnostic Box */}
                  <div className="bg-[#FAF8F5] border border-[#b5924d]/25 p-6 rounded-xl space-y-4">
                    <h4 className="text-lg font-serif text-[#b5924d] font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      {getDiagnostic().title}
                    </h4>
                    
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {getDiagnostic().description}
                    </p>

                    <div className="pt-4 border-t border-slate-200/60 space-y-2">
                       <span className="block text-xs uppercase tracking-wider text-slate-550 font-medium">Próximo Passo Recomendado:</span>
                      <p className="text-[#132238] text-sm font-semibold leading-relaxed">
                        ★ {getDiagnostic().recomenda}
                      </p>
                    </div>
                  </div>

                  {/* Warning disclaimer */}
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    *Atenção: Este simulador é um mecanismo informativo baseado no ordenamento jurídico vigente em 2026 e não substitui uma consulta formal com as especialistas do escritório. Os dados inseridos não criam obrigações automáticas de representação.
                  </p>

                  {/* Action buttons after simulation */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <a 
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform duration-300 transform hover:-translate-y-0.5 shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      Garantir Meu Direito via WhatsApp
                    </a>
                    
                    <button 
                      onClick={handleResetSimulator}
                      className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-[#132238] rounded-xl text-sm font-semibold tracking-wider transition-all border border-slate-200"
                    >
                      Refazer Simulação
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* DETAILED SERVICES / SOBRE SECTION - LIGHT CORPORATE */}
      <section id="sobre" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Aesthetic Imagery Side */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Image 1 - Maternal care */}
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#b5924d]/15 shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400" 
                    alt="Pezinhos de bebê recém-nascido sob cuidado materno" 
                    className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Decorative Box card */}
                <div className="bg-[#FAF8F5] border border-[#b5924d]/15 p-6 rounded-2xl text-center shadow-xs">
                  <div className="text-3xl font-serif text-[#b5924d] font-bold">120 dias</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold leading-relaxed">
                    Salário-Maternidade mínimo garantido pela CLT
                  </div>
                </div>
              </div>

              {/* Image 2 - Professional law consultation */}
              <div className="space-y-4 pt-10">
                <div className="bg-[#FAF8F5] border border-[#b5924d]/25 p-6 rounded-2xl text-center shadow-xs">
                  <span className="block text-[#b5924d] font-serif font-bold text-lg mb-1">Dano Moral</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block leading-tight font-semibold">
                    Prevenção contra o Assédio Gestacional
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-[#b5924d]/15 shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                    alt="Advogada especialista altamente capacitada e acolhedora" 
                    className="w-full h-[180px] object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </div>

            {/* Back absolute circle layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#b5924d]/3 blur-3xl rounded-full pointer-events-none" />
          </div>

          {/* Text/Content Storytelling Side */}
          <div className="flex flex-col text-left justify-center">
            <span className="text-[#b5924d] text-xs font-semibold uppercase tracking-widest block mb-3">Compromisso Implacável</span>
            <h2 className="font-serif text-3.5xl md:text-5xl text-[#132238] tracking-tight leading-tight mb-8 font-bold">
              Amparo Estratégico para Mães em Período de Gestação
            </h2>
            
            <p className="text-slate-600 text-lg leading-relaxed font-light mb-6">
              A chegada de um filho é um dos momentos de maior vulnerabilidade e felicidade de uma mulher. Infelizmente, no ambiente de trabalho e nas agências do INSS, esse período muitas vezes é marcado por desligamentos retaliatórios, cortes de benefícios e barreiras administrativas crueis.
            </p>

            <p className="text-slate-500 text-sm leading-relaxed font-light mb-8">
              O <strong className="text-[#132238] font-semibold">Seu Direito Prime</strong> nasceu com a missão de quebrar paradigmas: unimos o rigor técnico das maiores bancas de advocacia trabalhista do país ao atendimento profundamente humano, empático e de acolhimento que as mães merecem para seu bebê ter tranquilidade em cada etapa do seu caso.
            </p>

            {/* Pillars list */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#b5924d]/15 flex items-center justify-center flex-shrink-0 text-[#b5924d] mt-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#132238] text-base">Especialização Exclusiva de Proteção à Mãe</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Conhecemos profundamente cada jurisprudência trabalhista protetora brasileira, garantindo as indenizações máximas.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#b5924d]/15 flex items-center justify-center flex-shrink-0 text-[#b5924d] mt-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#132238] text-base">Atendimento Humanizado Sem Burocracia</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Acompanhamos você de forma próxima, tirando suas dúvidas com carinho nas reuniões digitais de qualquer local.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#b5924d]/15 flex items-center justify-center flex-shrink-0 text-[#b5924d] mt-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#132238] text-base">Derrubada Administrativa do INSS</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Focamos pontualmente nas mães desempregadas ou autônomas cujos salários-maternidade foram indevidamente barrados pelo INSS.</p>
                </div>
              </div>
            </div>

            {/* Accent Message from Attorney */}
            <div className="mt-10 p-6 rounded-r-xl bg-[#FAF8F5]/90 border-l-4 border-[#b5924d] italic text-xs leading-relaxed text-slate-700 shadow-xs">
              "Para garantir estabilidade, nós fazemos uma revisão de ponta a ponta em sua carteira, contracheques e comunicações internas. Você se concentra na sua gestação; nós lutamos pelo seu direito."
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION (LUXURIOUS CARDS WITH SOCIAL PROOF) - LIGHT CORPORATE */}
      <section id="depoimentos" className="py-24 px-6 bg-[#FAF8F5] relative overflow-hidden border-t border-slate-200/60">
        
        {/* Background glow strip */}
        <div className="absolute right-12 bottom-12 w-96 h-96 bg-[#b5924d]/3 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-[#b5924d] text-xs font-semibold uppercase tracking-widest block mb-3">Depoimentos Reais</span>
            <h2 className="font-serif text-3.5xl md:text-5xl text-[#132238] tracking-tight leading-tight font-bold">
              Histórias de Mães que Conquistaram a Dignidade de Volta
            </h2>
            <p className="text-slate-600 mt-4 max-w-xl mx-auto font-light text-base md:text-lg">
              Veja relatos de mulheres reais que estavam desesperadas com demissões injustas ou indeferimentos do INSS e hoje têm seus lares estáveis.
            </p>
          </div>

          {/* Testimonial Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#b5924d]/10 p-8 rounded-2xl flex flex-col justify-between group hover:border-[#b5924d]/45 hover:shadow-lg transition-all duration-300 shadow-xs relative"
              >
                {/* Visual quote accent indicator */}
                <div className="text-4xl font-serif text-[#b5924d]/12 absolute top-6 right-8 font-bold select-none">”</div>
                
                <div className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#b5924d] text-[#b5924d]" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-600 text-sm leading-relaxed font-light italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#132238] text-sm">{test.name}</h4>
                    <p className="text-slate-400 text-[11px] font-medium tracking-wider uppercase mt-0.5">{test.location}</p>
                  </div>

                  {/* Benefit Tag badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#b5924d]/10 text-[#b5924d] text-[10px] font-semibold uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" />
                    <span>{test.tag}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Callout of safety */}
          <div className="mt-16 text-center max-w-lg mx-auto bg-white border border-slate-200/80 py-4 px-6 rounded-full text-xs text-slate-500 shadow-xs">
            ★ Atendimento legal confidencial, em conformidade com o Código de Ética e Disciplina da OAB.
          </div>

        </div>
      </section>

      {/* ACCORDION FAQ SECTION - LIGHT CORPORATE */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#b5924d] text-xs font-semibold uppercase tracking-widest block mb-3">Dúvidas Frequentes</span>
          <h2 className="font-serif text-3.5xl md:text-5xl text-[#132238] tracking-tight font-bold">
            Perguntas & Respostas Clínicas
          </h2>
          <p className="text-slate-600 mt-4 max-w-lg mx-auto font-light leading-relaxed">
            Esclarecemos as principais dúvidas recebidas pelas mães de modo simples e preciso antes do seu contato.
          </p>
        </div>

        {/* FAQ Accordions block */}
        <div className="space-y-4">
          {faqItems.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-[#FAF8F5]/55 border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#b5924d]/30 shadow-xs"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none hover:bg-white/40 cursor-pointer"
              >
                <span className="font-serif text-[#132238] text-base font-semibold pr-4">
                  {faq.question}
                </span>
                <div className={`p-1 bg-slate-100 text-[#b5924d] rounded-full transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 bg-[#b5924d]/15' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed font-light border-t border-slate-200/60 bg-white">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* LEAD CONVERSIONS & CONTACT SECTION - LIGHT CORPORATE */}
      <section id="contato" className="py-24 px-6 bg-white border-t border-slate-200/80 relative overflow-hidden">
        
        {/* Absolute glow bottom elements */}
        <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-[#b5924d]/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          
          {/* Form Left Info Block */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-10">
            <div>
              <span className="text-[#b5924d] text-xs font-semibold uppercase tracking-widest block mb-4">Contato Oficial</span>
              <h2 className="font-serif text-3.5xl sm:text-5xl text-[#132238] tracking-tight leading-tight mb-6 font-bold">
                Fale Conosco Diretamente por WhatsApp
              </h2>
              <p className="text-slate-600 leading-relaxed font-light text-base md:text-lg mb-8">
                Estamos prontos para ouvir o seu relato e examinar cada detalhe da sua situação com zelo e cuidado. O atendimento pelo WhatsApp é imediato, seguro e confidencial.
              </p>

              {/* Direct details info list */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-705 font-medium">Atendimento Digital Seguro e Rápido para Todo o Brasil</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex items-center justify-center">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-705 font-medium">Análise de Emergência Trabalhista de Segunda a Sábado</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#b5924d]/10 text-[#b5924d] flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-705 font-medium">Plantão Especialista para Casos de Demissão Involuntária</span>
                </div>
              </div>
            </div>

            {/* Live Chat Indicator / CTA Bubble */}
            <div className="p-6 bg-[#FAF8F5] border border-[#b5924d]/15 rounded-xl flex items-center gap-4 shadow-xs">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#b5924d]">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" 
                    alt="Especialista Seu Direito Prime" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
              </div>
              <div>
                <span className="text-xs text-[#b5924d] uppercase tracking-wider font-bold block leading-tight">Suporte Seu Direito Prime</span>
                <span className="text-xs text-slate-600 mt-1 block">"Disponível agora para atendimento online"</span>
              </div>
            </div>
          </div>

          {/* Luxury WhatsApp Direct Panel */}
          <div className="lg:col-span-6 bg-white border border-[#b5924d]/15 p-8 md:p-10 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden shadow-slate-100/80">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/4 rounded-bl-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Atendimento Prontamente Online
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#132238] font-bold">
                Conecte-se pelo Canal Oficial
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed font-light">
                Toque no botão abaixo para iniciar uma conversa segura de forma instantânea. A nossa equipe de defesa de direitos trabalhistas e do salário-maternidade irá analisar o seu caso sem compromisso.
              </p>

              {/* Big Display WhatsApp Number */}
              <div className="py-6 px-4 bg-[#FAF8F5] rounded-xl border border-slate-200/60 inline-flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">WhatsApp de Plantão</span>
                    <span className="font-serif text-lg font-bold text-[#132238] block">(11) 99121-7290</span>
                  </div>
                </div>
                
                <span className="hidden sm:inline px-3 py-1 rounded bg-[#b5924d]/10 text-[#b5924d] text-[10px] uppercase font-bold tracking-widest border border-[#b5924d]/20">
                  Sem Burocracia
                </span>
              </div>

              {/* Action Button */}
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Iniciar Atendimento no WhatsApp
              </a>

              <p className="text-[11px] text-slate-500 text-center leading-normal">
                Sua privacidade é resguardada em total sigilo profissional e em inteira conformidade com as diretrizes da LGPD (Lei Geral de Proteção de Dados).
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER SECTION - LIGHT CORPORATE */}
      <footer className="bg-[#FAF8F5] border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left text-xs text-slate-500">
          
          {/* Footer Logo & info */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-6 h-6 rounded bg-[#b5924d]/15 flex items-center justify-center text-[#b5924d]">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif text-sm tracking-widest text-[#b5924d] uppercase font-bold">SEU DIREITO PRIME</span>
            </div>
            <p className="max-w-xs leading-relaxed font-light text-slate-500">
              Atuação jurídica de alta performance e especializada em Direito do Trabalho Maternal e Previdenciário do Salário-Maternidade.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6 text-slate-650 text-xs font-semibold uppercase tracking-wider">
            <a href="#diferenciais" className="hover:text-[#b5924d] transition-colors">Diferenciais</a>
            <a href="#simulador" className="hover:text-[#b5924d] transition-colors">Simulador</a>
            <a href="#sobre" className="hover:text-[#b5924d] transition-colors">Sobre</a>
            <a href="#depoimentos" className="hover:text-[#b5924d] transition-colors">Depoimentos</a>
            <a href="#contato" className="hover:text-[#b5924d] transition-colors">Contato</a>
          </div>

          {/* Legal Copyright and compliance */}
          <div className="space-y-2 max-w-xs md:text-right">
            <span>© Copyright 2026 Seu Direito Prime.</span>
            <span className="block leading-relaxed mt-1 font-light text-[10px] text-slate-400">
              A publicidade deste website foi concebida sob os limites autorizados pelo novo Provimento da OAB que veda exclusivamente a captação mercantil ou mercantilização ilícita da profissão.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
