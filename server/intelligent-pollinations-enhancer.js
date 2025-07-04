
/**
 * 🧠🎨 ИНТЕЛЛЕКТУАЛЬНЫЙ УЛУЧШАТЕЛЬ POLLINATIONS.AI
 * Система для радикального улучшения качества генерации изображений
 * через семантический анализ, промпт-инжиниринг и адаптивную оптимизацию
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Интеграция с семантической системой
let visualSemanticAnalyzer;
try {
  visualSemanticAnalyzer = require('./semantic-memory/visual-semantic-analyzer.cjs');
} catch (e) {
  console.warn('⚠️ Визуальный семантический анализатор недоступен');
}

// Директории для кэширования и обработки
const CACHE_DIR = path.join(__dirname, '..', 'cache', 'pollinations');
const ENHANCED_DIR = path.join(__dirname, '..', 'output', 'enhanced');

// Создаем директории
async function ensureDirectories() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.mkdir(ENHANCED_DIR, { recursive: true });
  } catch (error) {
    console.error('Ошибка создания директорий:', error);
  }
}

ensureDirectories();

/**
 * 📊 АНАЛИЗАТОР СТИЛЕЙ
 * Автоматически определяет нужный стиль на основе контекста
 */
class StyleAnalyzer {
  constructor() {
    this.stylePatterns = new Map();
    this.contextualRules = new Map();
    this.styleConfidenceThreshold = 0.7;
    
    this.initializeStylePatterns();
  }

  /**
   * Инициализация паттернов стилей
   */
  initializeStylePatterns() {
    // Фотореализм
    this.stylePatterns.set('photorealistic', {
      keywords: ['фото', 'реалистичный', 'человек', 'портрет', 'настоящий', 'жизненный'],
      antiKeywords: ['принт', 'логотип', 'вышивка', 'векторный', 'мультяшный'],
      modifiers: [
        'hyperrealistic', 'photorealistic', 'detailed skin texture', 
        'natural proportions', 'professional photography', 'studio lighting',
        'authentic materials', 'lifelike details', 'real world lighting'
      ],
      qualityBoosts: ['8k resolution', 'ultra detailed', 'sharp focus'],
      confidence: 0.9
    });

    // Векторная графика
    this.stylePatterns.set('vector', {
      keywords: ['принт', 'футболка', 'логотип', 'дизайн', 'графика', 'иконка'],
      antiKeywords: ['фото', 'реалистичный', 'вышивка', 'текстура'],
      modifiers: [
        'vector art style', 'clean lines', 'bold graphics', 'flat design',
        'limited color palette', 'high contrast', 'geometric shapes',
        'scalable graphics', 'crisp edges'
      ],
      qualityBoosts: ['print ready', 'scalable vector', 'clean design'],
      confidence: 0.85
    });

    // Вышивка
    this.stylePatterns.set('embroidery', {
      keywords: ['вышивка', 'вышивку', 'embroidery', 'нитки', 'ткань'],
      antiKeywords: ['фото', 'принт', 'футболка'],
      modifiers: [
        'embroidery design pattern', 'machine embroidery ready', 
        'clear defined areas', 'limited color palette', 'flat colors',
        'no gradients', 'simplified shapes', 'textile art style',
        'needlework pattern'
      ],
      qualityBoosts: ['embroidery friendly', 'stitch ready', 'thread colors'],
      confidence: 0.95
    });

    // Художественный стиль
    this.stylePatterns.set('artistic', {
      keywords: ['художественный', 'искусство', 'живопись', 'картина', 'творческий'],
      antiKeywords: ['фото', 'принт', 'логотип'],
      modifiers: [
        'artistic painting style', 'fine art', 'painterly', 'expressive brushstrokes',
        'artistic interpretation', 'creative composition', 'art gallery quality'
      ],
      qualityBoosts: ['masterpiece', 'artistic excellence', 'gallery worthy'],
      confidence: 0.8
    });
  }

  /**
   * Анализирует запрос и определяет подходящий стиль
   */
  analyzeStyle(prompt, context = {}) {
    const analysis = {
      detectedStyle: 'photorealistic',
      confidence: 0.5,
      reasoning: [],
      appliedModifiers: [],
      qualityBoosts: []
    };

    let maxConfidence = 0;
    let bestStyle = 'photorealistic';

    // Анализируем каждый стиль
    for (const [styleName, styleData] of this.stylePatterns) {
      let confidence = 0;
      const reasoning = [];

      // Проверяем ключевые слова
      const keywordMatches = styleData.keywords.filter(keyword => 
        prompt.toLowerCase().includes(keyword)
      ).length;
      
      if (keywordMatches > 0) {
        confidence += keywordMatches * 0.3;
        reasoning.push(`найдено ${keywordMatches} ключевых слов для ${styleName}`);
      }

      // Проверяем анти-ключевые слова (снижают уверенность)
      const antiKeywordMatches = styleData.antiKeywords.filter(keyword => 
        prompt.toLowerCase().includes(keyword)
      ).length;
      
      if (antiKeywordMatches > 0) {
        confidence -= antiKeywordMatches * 0.2;
        reasoning.push(`найдено ${antiKeywordMatches} конфликтующих слов`);
      }

      // Контекстный анализ
      if (context.hasRecentImages) {
        if (context.lastImageStyle === styleName) {
          confidence += 0.2;
          reasoning.push('соответствует стилю предыдущего изображения');
        }
      }

      // Проект-специфичный контекст
      if (context.projectType) {
        if (styleName === 'vector' && context.projectType === 'print_design') {
          confidence += 0.3;
          reasoning.push('соответствует типу проекта');
        }
        if (styleName === 'embroidery' && context.projectType === 'embroidery_design') {
          confidence += 0.4;
          reasoning.push('соответствует типу проекта');
        }
      }

      // Учитываем базовую уверенность стиля
      confidence *= styleData.confidence;

      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        bestStyle = styleName;
        analysis.reasoning = reasoning;
      }
    }

    analysis.detectedStyle = bestStyle;
    analysis.confidence = maxConfidence;
    
    // Применяем модификаторы выбранного стиля
    const styleData = this.stylePatterns.get(bestStyle);
    analysis.appliedModifiers = styleData.modifiers;
    analysis.qualityBoosts = styleData.qualityBoosts;

    return analysis;
  }
}

/**
 * 🎨 ЦВЕТОВАЯ СЕМАНТИКА
 * Умный подбор цветовых палитр на основе эмоций и целей
 */
class ColorSemantics {
  constructor() {
    this.emotionalPalettes = new Map();
    this.purposePalettes = new Map();
    this.brandPalettes = new Map();
    
    this.initializeColorSemantics();
  }

  initializeColorSemantics() {
    // Эмоциональные палитры
    this.emotionalPalettes.set('energetic', {
      colors: ['vibrant red', 'electric blue', 'bright orange', 'neon yellow'],
      modifiers: ['high saturation', 'bold colors', 'dynamic contrast'],
      emotions: ['energy', 'excitement', 'passion', 'power']
    });

    this.emotionalPalettes.set('calming', {
      colors: ['soft blue', 'gentle green', 'warm beige', 'light gray'],
      modifiers: ['muted tones', 'soft colors', 'harmonious palette'],
      emotions: ['peace', 'tranquility', 'relaxation', 'comfort']
    });

    this.emotionalPalettes.set('professional', {
      colors: ['navy blue', 'charcoal gray', 'white', 'silver'],
      modifiers: ['corporate colors', 'professional palette', 'business appropriate'],
      emotions: ['trust', 'reliability', 'competence', 'authority']
    });

    this.emotionalPalettes.set('creative', {
      colors: ['purple', 'teal', 'coral', 'gold'],
      modifiers: ['artistic colors', 'creative palette', 'inspiring tones'],
      emotions: ['creativity', 'innovation', 'inspiration', 'uniqueness']
    });

    // Целевые палитры
    this.purposePalettes.set('logo_design', {
      colors: ['strong primary', 'accent color', 'neutral base'],
      modifiers: ['brand colors', 'memorable palette', 'scalable colors'],
      characteristics: ['simple', 'distinctive', 'memorable']
    });

    this.purposePalettes.set('t_shirt_print', {
      colors: ['maximum 5 colors', 'high contrast', 'print-safe colors'],
      modifiers: ['screen printing ready', 'solid colors only', 'no gradients'],
      characteristics: ['bold', 'simple', 'cost-effective']
    });

    this.purposePalettes.set('embroidery', {
      colors: ['thread-available colors', 'limited palette', 'solid colors'],
      modifiers: ['embroidery thread colors', 'machine compatible', 'flat colors'],
      characteristics: ['simple', 'defined', 'stitch-friendly']
    });
  }

  /**
   * Анализирует цветовые потребности
   */
  analyzeColorNeeds(prompt, style, emotionalContext = {}) {
    const analysis = {
      recommendedPalette: [],
      colorModifiers: [],
      emotionalAlignment: [],
      purposeAlignment: [],
      restrictions: []
    };

    // Определяем эмоциональный контекст
    let detectedEmotion = 'professional'; // по умолчанию
    
    const emotionalWords = {
      'energetic': ['энергия', 'динамика', 'мощь', 'сила', 'активный'],
      'calming': ['спокойный', 'мирный', 'расслабляющий', 'нежный'],
      'professional': ['деловой', 'профессиональный', 'корпоративный', 'серьезный'],
      'creative': ['творческий', 'креативный', 'художественный', 'уникальный']
    };

    for (const [emotion, words] of Object.entries(emotionalWords)) {
      if (words.some(word => prompt.toLowerCase().includes(word))) {
        detectedEmotion = emotion;
        break;
      }
    }

    // Применяем эмоциональную палитру
    if (this.emotionalPalettes.has(detectedEmotion)) {
      const palette = this.emotionalPalettes.get(detectedEmotion);
      analysis.recommendedPalette.push(...palette.colors);
      analysis.colorModifiers.push(...palette.modifiers);
      analysis.emotionalAlignment = palette.emotions;
    }

    // Определяем цель использования
    let detectedPurpose = null;
    
    if (style === 'vector' && prompt.includes('принт')) {
      detectedPurpose = 't_shirt_print';
    } else if (style === 'embroidery') {
      detectedPurpose = 'embroidery';
    } else if (prompt.includes('логотип')) {
      detectedPurpose = 'logo_design';
    }

    // Применяем целевую палитру
    if (detectedPurpose && this.purposePalettes.has(detectedPurpose)) {
      const purposePalette = this.purposePalettes.get(detectedPurpose);
      analysis.recommendedPalette.push(...purposePalette.colors);
      analysis.colorModifiers.push(...purposePalette.modifiers);
      analysis.purposeAlignment = purposePalette.characteristics;
      
      // Добавляем ограничения
      if (detectedPurpose === 't_shirt_print') {
        analysis.restrictions.push('no gradients', 'solid colors only', 'maximum 5 colors');
      } else if (detectedPurpose === 'embroidery') {
        analysis.restrictions.push('no gradients', 'limited color palette', 'thread-safe colors');
      }
    }

    return analysis;
  }
}

/**
 * 🏗️ КОМПОЗИЦИОННАЯ СЕМАНТИКА
 * Анализ расположения элементов для максимального воздействия
 */
class CompositionSemantics {
  constructor() {
    this.compositionRules = new Map();
    this.impactStrategies = new Map();
    
    this.initializeCompositionRules();
  }

  initializeCompositionRules() {
    // Правила композиции для разных целей
    this.compositionRules.set('logo', {
      principles: ['centered composition', 'balanced elements', 'clear hierarchy'],
      modifiers: ['symmetrical layout', 'focal point center', 'clean spacing'],
      avoidance: ['complex backgrounds', 'multiple focal points', 'cluttered design']
    });

    this.compositionRules.set('t_shirt_print', {
      principles: ['strong focal point', 'balanced composition', 'print area optimization'],
      modifiers: ['centered design', 'chest placement ready', 'scalable composition'],
      avoidance: ['edge bleeding', 'too much detail', 'weak contrast']
    });

    this.compositionRules.set('embroidery', {
      principles: ['simple composition', 'clear areas', 'stitch-friendly layout'],
      modifiers: ['defined regions', 'no overlapping elements', 'embroidery optimized'],
      avoidance: ['complex intersections', 'thin lines', 'gradual transitions']
    });

    this.compositionRules.set('artistic', {
      principles: ['dynamic composition', 'visual flow', 'emotional impact'],
      modifiers: ['rule of thirds', 'leading lines', 'visual hierarchy'],
      avoidance: ['static composition', 'centered everything', 'lack of movement']
    });

    // Стратегии воздействия
    this.impactStrategies.set('maximum_attention', {
      techniques: ['high contrast', 'bold elements', 'dynamic angles'],
      composition: 'asymmetrical with strong focal point',
      colors: 'high saturation and contrast'
    });

    this.impactStrategies.set('professional_trust', {
      techniques: ['balanced layout', 'clean lines', 'structured composition'],
      composition: 'symmetrical and organized',
      colors: 'professional color scheme'
    });

    this.impactStrategies.set('emotional_connection', {
      techniques: ['soft transitions', 'organic shapes', 'warm lighting'],
      composition: 'flowing and natural',
      colors: 'emotionally resonant palette'
    });
  }

  /**
   * Анализирует композиционные потребности
   */
  analyzeComposition(prompt, style, purpose) {
    const analysis = {
      recommendedComposition: [],
      impactStrategy: 'professional_trust',
      compositionModifiers: [],
      layoutPrinciples: [],
      avoidanceRules: []
    };

    // Определяем тип композиции на основе стиля
    let compositionType = 'artistic';
    
    if (style === 'vector' && prompt.includes('логотип')) {
      compositionType = 'logo';
    } else if (style === 'vector' && prompt.includes('принт')) {
      compositionType = 't_shirt_print';
    } else if (style === 'embroidery') {
      compositionType = 'embroidery';
    }

    // Применяем правила композиции
    if (this.compositionRules.has(compositionType)) {
      const rules = this.compositionRules.get(compositionType);
      analysis.layoutPrinciples = rules.principles;
      analysis.compositionModifiers = rules.modifiers;
      analysis.avoidanceRules = rules.avoidance;
    }

    // Определяем стратегию воздействия
    if (prompt.includes('внимание') || prompt.includes('яркий') || prompt.includes('заметный')) {
      analysis.impactStrategy = 'maximum_attention';
    } else if (prompt.includes('деловой') || prompt.includes('профессиональный')) {
      analysis.impactStrategy = 'professional_trust';
    } else if (prompt.includes('эмоциональный') || prompt.includes('трогательный')) {
      analysis.impactStrategy = 'emotional_connection';
    }

    // Применяем стратегию воздействия
    if (this.impactStrategies.has(analysis.impactStrategy)) {
      const strategy = this.impactStrategies.get(analysis.impactStrategy);
      analysis.recommendedComposition.push(strategy.composition);
      analysis.compositionModifiers.push(...strategy.techniques);
    }

    return analysis;
  }
}

/**
 * 🎯 АНАЛИЗАТОР НАМЕРЕНИЙ
 * Понимает, что именно хочет пользователь
 */
class IntentionAnalyzer {
  constructor() {
    this.intentPatterns = new Map();
    this.contextualClues = new Map();
    
    this.initializeIntentPatterns();
  }

  initializeIntentPatterns() {
    // Паттерны намерений
    this.intentPatterns.set('logo_creation', {
      keywords: ['логотип', 'лого', 'бренд', 'компания', 'марка'],
      indicators: ['для компании', 'бренда', 'логотип компании'],
      confidence: 0.9,
      requirements: ['simple', 'memorable', 'scalable', 'professional']
    });

    this.intentPatterns.set('print_design', {
      keywords: ['принт', 'футболка', 'печать', 'дизайн для печати'],
      indicators: ['на футболку', 'для печати', 'принт дизайн'],
      confidence: 0.85,
      requirements: ['bold', 'high contrast', 'print ready', 'limited colors']
    });

    this.intentPatterns.set('embroidery_design', {
      keywords: ['вышивка', 'вышивку', 'embroidery', 'для вышивки'],
      indicators: ['вышивальная машина', 'нитки', 'стежки'],
      confidence: 0.95,
      requirements: ['simple shapes', 'clear areas', 'limited colors', 'no gradients']
    });

    this.intentPatterns.set('illustration', {
      keywords: ['иллюстрация', 'рисунок', 'картинка', 'изображение'],
      indicators: ['художественный', 'красивый', 'детальный'],
      confidence: 0.7,
      requirements: ['artistic', 'detailed', 'expressive', 'creative']
    });

    this.intentPatterns.set('icon_design', {
      keywords: ['иконка', 'значок', 'символ', 'пиктограмма'],
      indicators: ['для интерфейса', 'UI', 'веб-дизайн'],
      confidence: 0.8,
      requirements: ['simple', 'clear', 'recognizable', 'minimal']
    });
  }

  /**
   * Анализирует намерения пользователя
   */
  analyzeIntention(prompt, context = {}) {
    const analysis = {
      primaryIntention: 'illustration',
      confidence: 0.5,
      detectedIntentions: [],
      requirements: [],
      reasoning: []
    };

    let maxConfidence = 0;
    let bestIntention = 'illustration';

    // Анализируем каждое намерение
    for (const [intentionName, intentionData] of this.intentPatterns) {
      let confidence = 0;
      const reasoning = [];

      // Проверяем ключевые слова
      const keywordMatches = intentionData.keywords.filter(keyword => 
        prompt.toLowerCase().includes(keyword)
      ).length;
      
      if (keywordMatches > 0) {
        confidence += keywordMatches * 0.4;
        reasoning.push(`найдено ${keywordMatches} ключевых слов`);
      }

      // Проверяем индикаторы
      const indicatorMatches = intentionData.indicators.filter(indicator => 
        prompt.toLowerCase().includes(indicator)
      ).length;
      
      if (indicatorMatches > 0) {
        confidence += indicatorMatches * 0.3;
        reasoning.push(`найдено ${indicatorMatches} индикаторов`);
      }

      // Контекстный анализ
      if (context.projectHistory) {
        const similarProjects = context.projectHistory.filter(project => 
          project.intention === intentionName
        ).length;
        
        if (similarProjects > 0) {
          confidence += Math.min(similarProjects * 0.1, 0.2);
          reasoning.push(`похожие проекты в истории: ${similarProjects}`);
        }
      }

      // Учитываем базовую уверенность
      confidence *= intentionData.confidence;

      // Сохраняем все обнаруженные намерения
      if (confidence > 0.3) {
        analysis.detectedIntentions.push({
          intention: intentionName,
          confidence,
          reasoning: [...reasoning]
        });
      }

      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        bestIntention = intentionName;
        analysis.reasoning = reasoning;
      }
    }

    analysis.primaryIntention = bestIntention;
    analysis.confidence = maxConfidence;
    
    // Добавляем требования для выбранного намерения
    const intentionData = this.intentPatterns.get(bestIntention);
    analysis.requirements = intentionData.requirements;

    return analysis;
  }
}

/**
 * 📝 СТИЛЕВОЙ ПЕРЕВОДЧИК
 * Автоматически добавляет правильные модификаторы для нужного стиля
 */
class StyleTranslator {
  constructor() {
    this.translationRules = new Map();
    this.contextualModifiers = new Map();
    
    this.initializeTranslationRules();
  }

  initializeTranslationRules() {
    // Правила перевода для разных стилей
    this.translationRules.set('photorealistic', {
      baseModifiers: [
        'hyperrealistic', 'photorealistic', 'detailed skin texture',
        'natural proportions', 'professional photography', 'studio lighting'
      ],
      qualityEnhancers: [
        '8k resolution', 'ultra detailed', 'sharp focus', 'professional quality'
      ],
      lightingModifiers: [
        'natural lighting', 'soft shadows', 'realistic reflections'
      ]
    });

    this.translationRules.set('vector', {
      baseModifiers: [
        'vector art style', 'clean lines', 'bold graphics', 'flat design',
        'limited color palette', 'high contrast'
      ],
      qualityEnhancers: [
        'print ready', 'scalable vector', 'crisp edges', 'professional design'
      ],
      compositionModifiers: [
        'geometric shapes', 'simple composition', 'clear hierarchy'
      ]
    });

    this.translationRules.set('embroidery', {
      baseModifiers: [
        'embroidery design pattern', 'machine embroidery ready',
        'clear defined areas', 'limited color palette', 'flat colors'
      ],
      qualityEnhancers: [
        'embroidery friendly', 'stitch ready', 'thread colors', 'textile art'
      ],
      restrictionModifiers: [
        'no gradients', 'simplified shapes', 'no overlapping elements'
      ]
    });
  }

  /**
   * Переводит промпт с добавлением стилевых модификаторов
   */
  translatePrompt(prompt, style, intention, colorAnalysis, compositionAnalysis) {
    let enhancedPrompt = prompt;

    // Добавляем базовые модификаторы стиля
    if (this.translationRules.has(style)) {
      const rules = this.translationRules.get(style);
      
      // Базовые модификаторы
      const baseModifiers = rules.baseModifiers.slice(0, 3).join(', ');
      enhancedPrompt = `${baseModifiers}, ${enhancedPrompt}`;
      
      // Модификаторы качества
      const qualityModifiers = rules.qualityEnhancers.slice(0, 2).join(', ');
      enhancedPrompt = `${enhancedPrompt}, ${qualityModifiers}`;
    }

    // Добавляем цветовые модификаторы
    if (colorAnalysis.colorModifiers.length > 0) {
      const colorMods = colorAnalysis.colorModifiers.slice(0, 2).join(', ');
      enhancedPrompt = `${enhancedPrompt}, ${colorMods}`;
    }

    // Добавляем композиционные модификаторы
    if (compositionAnalysis.compositionModifiers.length > 0) {
      const compMods = compositionAnalysis.compositionModifiers.slice(0, 2).join(', ');
      enhancedPrompt = `${enhancedPrompt}, ${compMods}`;
    }

    // Добавляем требования намерения
    if (intention.requirements.length > 0) {
      const intentMods = intention.requirements.slice(0, 2).join(', ');
      enhancedPrompt = `${enhancedPrompt}, ${intentMods}`;
    }

    // Очищаем и оптимизируем
    enhancedPrompt = this.cleanupPrompt(enhancedPrompt);

    return enhancedPrompt;
  }

  /**
   * Очищает и оптимизирует промпт
   */
  cleanupPrompt(prompt) {
    return prompt
      .replace(/\s+/g, ' ')
      .replace(/,+/g, ',')
      .replace(/^,|,$/, '')
      .trim();
  }
}

/**
 * 🔮 ПРЕДИКТОР КАЧЕСТВА
 * Анализирует промпт и предсказывает качество результата
 */
class QualityPredictor {
  constructor() {
    this.qualityFactors = new Map();
    this.predictionModel = new Map();
    
    this.initializeQualityFactors();
  }

  initializeQualityFactors() {
    // Факторы качества
    this.qualityFactors.set('prompt_clarity', {
      weight: 0.3,
      calculator: (prompt) => {
        const words = prompt.split(' ').length;
        const clarity = Math.min(words / 20, 1) * 0.7 + 
                       (prompt.includes('детальный') ? 0.3 : 0);
        return Math.min(clarity, 1);
      }
    });

    this.qualityFactors.set('style_consistency', {
      weight: 0.25,
      calculator: (prompt, style) => {
        const styleKeywords = {
          'photorealistic': ['фото', 'реалистичный', 'портрет'],
          'vector': ['принт', 'логотип', 'дизайн'],
          'embroidery': ['вышивка', 'нитки']
        };
        
        const relevantKeywords = styleKeywords[style] || [];
        const matches = relevantKeywords.filter(kw => prompt.includes(kw)).length;
        return Math.min(matches / relevantKeywords.length, 1);
      }
    });

    this.qualityFactors.set('technical_requirements', {
      weight: 0.2,
      calculator: (prompt, style, requirements) => {
        let score = 0.5; // базовый
        
        if (requirements.includes('simple') && prompt.includes('простой')) score += 0.2;
        if (requirements.includes('detailed') && prompt.includes('детальный')) score += 0.2;
        if (requirements.includes('professional') && prompt.includes('профессиональный')) score += 0.1;
        
        return Math.min(score, 1);
      }
    });

    this.qualityFactors.set('color_specification', {
      weight: 0.15,
      calculator: (prompt, colorAnalysis) => {
        let score = 0.3; // базовый
        
        if (colorAnalysis.recommendedPalette.length > 0) score += 0.3;
        if (colorAnalysis.restrictions.length > 0) score += 0.2;
        if (prompt.match(/цвет|color/g)) score += 0.2;
        
        return Math.min(score, 1);
      }
    });

    this.qualityFactors.set('composition_clarity', {
      weight: 0.1,
      calculator: (prompt, compositionAnalysis) => {
        let score = 0.4; // базовый
        
        if (compositionAnalysis.layoutPrinciples.length > 0) score += 0.3;
        if (prompt.includes('центр') || prompt.includes('композиция')) score += 0.3;
        
        return Math.min(score, 1);
      }
    });
  }

  /**
   * Предсказывает качество результата
   */
  predictQuality(prompt, style, intention, colorAnalysis, compositionAnalysis) {
    let totalScore = 0;
    const factorScores = {};

    // Вычисляем каждый фактор
    for (const [factorName, factor] of this.qualityFactors) {
      let score = 0;
      
      switch (factorName) {
        case 'prompt_clarity':
          score = factor.calculator(prompt);
          break;
        case 'style_consistency':
          score = factor.calculator(prompt, style);
          break;
        case 'technical_requirements':
          score = factor.calculator(prompt, style, intention.requirements);
          break;
        case 'color_specification':
          score = factor.calculator(prompt, colorAnalysis);
          break;
        case 'composition_clarity':
          score = factor.calculator(prompt, compositionAnalysis);
          break;
      }
      
      factorScores[factorName] = score;
      totalScore += score * factor.weight;
    }

    const prediction = {
      overallScore: totalScore,
      confidence: this.calculateConfidence(factorScores),
      factorBreakdown: factorScores,
      recommendations: this.generateRecommendations(factorScores),
      expectedIssues: this.predictIssues(factorScores)
    };

    return prediction;
  }

  /**
   * Вычисляет уверенность в предсказании
   */
  calculateConfidence(factorScores) {
    const scores = Object.values(factorScores);
    const variance = this.calculateVariance(scores);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Высокая уверенность при низкой дисперсии и высоком среднем
    return Math.max(0, Math.min(1, avgScore - variance));
  }

  /**
   * Вычисляет дисперсию
   */
  calculateVariance(scores) {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
  }

  /**
   * Генерирует рекомендации по улучшению
   */
  generateRecommendations(factorScores) {
    const recommendations = [];

    if (factorScores.prompt_clarity < 0.6) {
      recommendations.push('Добавьте больше деталей в описание');
    }

    if (factorScores.style_consistency < 0.5) {
      recommendations.push('Уточните стиль изображения');
    }

    if (factorScores.color_specification < 0.5) {
      recommendations.push('Укажите предпочтительные цвета');
    }

    if (factorScores.composition_clarity < 0.6) {
      recommendations.push('Опишите желаемую композицию');
    }

    return recommendations;
  }

  /**
   * Предсказывает возможные проблемы
   */
  predictIssues(factorScores) {
    const issues = [];

    if (factorScores.technical_requirements < 0.4) {
      issues.push('Возможны проблемы с техническими требованиями');
    }

    if (factorScores.style_consistency < 0.3) {
      issues.push('Стиль может не соответствовать ожиданиям');
    }

    return issues;
  }
}

/**
 * 🔄 МУЛЬТИ-ГЕНЕРАТОР
 * Создает несколько вариантов и выбирает лучший
 */
class MultiGenerator {
  constructor() {
    this.generationStrategies = new Map();
    this.selectionCriteria = new Map();
    
    this.initializeStrategies();
  }

  initializeStrategies() {
    // Стратегии генерации
    this.generationStrategies.set('conservative', {
      description: 'Консервативный подход с проверенными модификаторами',
      modifierIntensity: 0.7,
      riskLevel: 0.2
    });

    this.generationStrategies.set('balanced', {
      description: 'Сбалансированный подход',
      modifierIntensity: 1.0,
      riskLevel: 0.5
    });

    this.generationStrategies.set('creative', {
      description: 'Креативный подход с экспериментальными модификаторами',
      modifierIntensity: 1.3,
      riskLevel: 0.8
    });
  }

  /**
   * Генерирует несколько вариантов
   */
  async generateMultipleVariants(basePrompt, enhancedPrompt, quality = 'ultra') {
    const variants = [];

    // Генерируем варианты с разными стратегиями
    for (const [strategyName, strategy] of this.generationStrategies) {
      const variantPrompt = this.applyStrategy(enhancedPrompt, strategy);
      const variantId = this.generateVariantId();
      
      try {
        const imageUrl = await this.generateSingleVariant(variantPrompt, variantId, quality);
        
        variants.push({
          id: variantId,
          strategy: strategyName,
          prompt: variantPrompt,
          imageUrl,
          score: 0, // будет вычислен позже
          metadata: {
            modifierIntensity: strategy.modifierIntensity,
            riskLevel: strategy.riskLevel
          }
        });
      } catch (error) {
        console.error(`Ошибка генерации варианта ${strategyName}:`, error);
      }
    }

    return variants;
  }

  /**
   * Применяет стратегию к промпту
   */
  applyStrategy(prompt, strategy) {
    const intensity = strategy.modifierIntensity;
    
    if (intensity < 0.8) {
      // Консервативный подход - убираем лишние модификаторы
      return prompt.split(', ').slice(0, 8).join(', ');
    } else if (intensity > 1.2) {
      // Креативный подход - добавляем экспериментальные модификаторы
      return `${prompt}, experimental style, artistic interpretation, unique approach`;
    }
    
    return prompt; // сбалансированный подход
  }

  /**
   * Генерирует один вариант
   */
  async generateSingleVariant(prompt, variantId, quality) {
    const { generateWithPollinations } = require('./ai-image-generator.js');
    return await generateWithPollinations(prompt, variantId, quality);
  }

  /**
   * Генерирует ID варианта
   */
  generateVariantId() {
    return `variant_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Выбирает лучший вариант
   */
  selectBestVariant(variants, selectionCriteria = {}) {
    if (variants.length === 0) return null;
    if (variants.length === 1) return variants[0];

    // Оцениваем каждый вариант
    variants.forEach(variant => {
      variant.score = this.scoreVariant(variant, selectionCriteria);
    });

    // Сортируем по оценке
    variants.sort((a, b) => b.score - a.score);

    return {
      bestVariant: variants[0],
      allVariants: variants,
      selectionReasoning: this.generateSelectionReasoning(variants[0], selectionCriteria)
    };
  }

  /**
   * Оценивает вариант
   */
  scoreVariant(variant, criteria) {
    let score = 0.5; // базовая оценка

    // Оценка на основе стратегии
    if (criteria.preferConservative && variant.strategy === 'conservative') {
      score += 0.3;
    } else if (criteria.preferCreative && variant.strategy === 'creative') {
      score += 0.3;
    } else if (variant.strategy === 'balanced') {
      score += 0.2; // сбалансированный всегда получает бонус
    }

    // Штрафы за высокий риск если не нужен
    if (!criteria.allowHighRisk && variant.metadata.riskLevel > 0.7) {
      score -= 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Генерирует объяснение выбора
   */
  generateSelectionReasoning(selectedVariant, criteria) {
    const reasons = [];

    reasons.push(`Выбран вариант со стратегией "${selectedVariant.strategy}"`);
    reasons.push(`Оценка качества: ${selectedVariant.score.toFixed(2)}`);
    
    if (selectedVariant.metadata.riskLevel < 0.5) {
      reasons.push('Низкий риск ошибок');
    }
    
    if (selectedVariant.strategy === 'balanced') {
      reasons.push('Оптимальный баланс качества и надежности');
    }

    return reasons;
  }
}

/**
 * 🎛️ АДАПТИВНЫЕ ПАРАМЕТРЫ
 * Автоматический подбор размера, качества, seed'а
 */
class AdaptiveParameters {
  constructor() {
    this.parameterRules = new Map();
    this.contextualAdjustments = new Map();
    
    this.initializeParameterRules();
  }

  initializeParameterRules() {
    // Правила для разных типов изображений
    this.parameterRules.set('logo', {
      preferredSizes: [
        { width: 1024, height: 1024, usage: 'square_logo' },
        { width: 1920, height: 1080, usage: 'banner_logo' },
        { width: 500, height: 500, usage: 'icon_logo' }
      ],
      qualitySettings: { model: 'flux-pro', enhance: true, quality: 'ultra' },
      aspectRatio: '1:1'
    });

    this.parameterRules.set('t_shirt_print', {
      preferredSizes: [
        { width: 3000, height: 3000, usage: 'high_quality_print' },
        { width: 2048, height: 2048, usage: 'standard_print' }
      ],
      qualitySettings: { model: 'flux-pro', enhance: true, quality: 'ultra' },
      aspectRatio: '1:1'
    });

    this.parameterRules.set('embroidery', {
      preferredSizes: [
        { width: 1024, height: 1024, usage: 'machine_embroidery' },
        { width: 800, height: 600, usage: 'rectangular_patch' }
      ],
      qualitySettings: { model: 'flux', enhance: true, quality: 'hd' },
      aspectRatio: 'flexible'
    });

    this.parameterRules.set('illustration', {
      preferredSizes: [
        { width: 2048, height: 2048, usage: 'high_detail' },
        { width: 1024, height: 1024, usage: 'standard' }
      ],
      qualitySettings: { model: 'flux-pro', enhance: true, quality: 'ultra' },
      aspectRatio: 'flexible'
    });
  }

  /**
   * Подбирает оптимальные параметры
   */
  optimizeParameters(intention, style, context = {}) {
    const optimization = {
      size: { width: 1024, height: 1024 },
      quality: 'hd',
      model: 'flux',
      seed: this.generateOptimalSeed(context),
      enhance: true,
      additionalParams: {}
    };

    // Определяем тип изображения для параметров
    let imageType = 'illustration';
    
    if (intention.primaryIntention === 'logo_creation') {
      imageType = 'logo';
    } else if (intention.primaryIntention === 'print_design') {
      imageType = 't_shirt_print';
    } else if (intention.primaryIntention === 'embroidery_design') {
      imageType = 'embroidery';
    }

    // Применяем правила для типа изображения
    if (this.parameterRules.has(imageType)) {
      const rules = this.parameterRules.get(imageType);
      
      // Выбираем подходящий размер
      const sizeOption = this.selectBestSize(rules.preferredSizes, context);
      optimization.size = { width: sizeOption.width, height: sizeOption.height };
      
      // Применяем настройки качества
      Object.assign(optimization, rules.qualitySettings);
    }

    // Контекстные корректировки
    this.applyContextualAdjustments(optimization, context);

    return optimization;
  }

  /**
   * Выбирает лучший размер
   */
  selectBestSize(sizeOptions, context) {
    // По умолчанию первый вариант
    let selectedSize = sizeOptions[0];

    // Если указано предпочтение по использованию
    if (context.intendedUse) {
      const matchingSize = sizeOptions.find(size => 
        size.usage === context.intendedUse
      );
      if (matchingSize) {
        selectedSize = matchingSize;
      }
    }

    // Если есть ограничения по размеру
    if (context.maxWidth && selectedSize.width > context.maxWidth) {
      selectedSize = sizeOptions.find(size => 
        size.width <= context.maxWidth
      ) || selectedSize;
    }

    return selectedSize;
  }

  /**
   * Генерирует оптимальный seed
   */
  generateOptimalSeed(context) {
    if (context.consistencyRequired && context.projectSeed) {
      // Используем seed проекта для консистентности
      return context.projectSeed;
    }

    if (context.userPreferences && context.userPreferences.preferredSeed) {
      return context.userPreferences.preferredSeed;
    }

    // Генерируем новый seed
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  /**
   * Применяет контекстные корректировки
   */
  applyContextualAdjustments(optimization, context) {
    // Корректировка для быстрой генерации
    if (context.prioritizeSpeed) {
      optimization.model = 'flux';
      optimization.quality = 'standard';
      optimization.size.width = Math.min(optimization.size.width, 1024);
      optimization.size.height = Math.min(optimization.size.height, 1024);
    }

    // Корректировка для максимального качества
    if (context.prioritizeQuality) {
      optimization.model = 'flux-pro';
      optimization.quality = 'ultra';
      optimization.enhance = true;
    }

    // Корректировка для печати
    if (context.forPrint) {
      optimization.size.width = Math.max(optimization.size.width, 2048);
      optimization.size.height = Math.max(optimization.size.height, 2048);
      optimization.quality = 'ultra';
    }
  }
}

/**
 * 🏢 БРЕНДИНГОВАЯ СОГЛАСОВАННОСТЬ
 * Поддержание единого стиля в рамках проекта
 */
class BrandConsistency {
  constructor() {
    this.brandProfiles = new Map();
    this.styleMemory = new Map();
    this.consistencyRules = new Map();
    
    this.initializeConsistencyRules();
  }

  initializeConsistencyRules() {
    this.consistencyRules.set('color_palette', {
      importance: 0.9,
      enforcer: (currentPalette, brandPalette) => {
        return brandPalette.length > 0 ? brandPalette : currentPalette;
      }
    });

    this.consistencyRules.set('style_modifiers', {
      importance: 0.8,
      enforcer: (currentModifiers, brandModifiers) => {
        return [...new Set([...brandModifiers, ...currentModifiers])];
      }
    });

    this.consistencyRules.set('composition_principles', {
      importance: 0.7,
      enforcer: (currentPrinciples, brandPrinciples) => {
        return brandPrinciples.length > 0 ? brandPrinciples : currentPrinciples;
      }
    });
  }

  /**
   * Создает или обновляет профиль бренда
   */
  createBrandProfile(projectId, brandData) {
    const profile = {
      projectId,
      colorPalette: brandData.colors || [],
      styleModifiers: brandData.modifiers || [],
      compositionPrinciples: brandData.composition || [],
      qualityStandards: brandData.quality || {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      imageHistory: []
    };

    this.brandProfiles.set(projectId, profile);
    return profile;
  }

  /**
   * Применяет брендинговую согласованность
   */
  applyBrandConsistency(projectId, analysis) {
    if (!this.brandProfiles.has(projectId)) {
      // Создаем новый профиль на основе текущего анализа
      this.createBrandProfile(projectId, {
        colors: analysis.colorAnalysis.recommendedPalette,
        modifiers: analysis.styleAnalysis.appliedModifiers,
        composition: analysis.compositionAnalysis.layoutPrinciples
      });
      return analysis; // первое изображение устанавливает стандарт
    }

    const brandProfile = this.brandProfiles.get(projectId);
    const consistentAnalysis = { ...analysis };

    // Применяем правила согласованности
    for (const [ruleName, rule] of this.consistencyRules) {
      switch (ruleName) {
        case 'color_palette':
          if (brandProfile.colorPalette.length > 0) {
            consistentAnalysis.colorAnalysis.recommendedPalette = 
              rule.enforcer(analysis.colorAnalysis.recommendedPalette, brandProfile.colorPalette);
          }
          break;

        case 'style_modifiers':
          if (brandProfile.styleModifiers.length > 0) {
            consistentAnalysis.styleAnalysis.appliedModifiers = 
              rule.enforcer(analysis.styleAnalysis.appliedModifiers, brandProfile.styleModifiers);
          }
          break;

        case 'composition_principles':
          if (brandProfile.compositionPrinciples.length > 0) {
            consistentAnalysis.compositionAnalysis.layoutPrinciples = 
              rule.enforcer(analysis.compositionAnalysis.layoutPrinciples, brandProfile.compositionPrinciples);
          }
          break;
      }
    }

    return consistentAnalysis;
  }

  /**
   * Обновляет профиль бренда после создания изображения
   */
  updateBrandProfile(projectId, imageData) {
    if (!this.brandProfiles.has(projectId)) return;

    const profile = this.brandProfiles.get(projectId);
    profile.imageHistory.push({
      imageUrl: imageData.imageUrl,
      prompt: imageData.prompt,
      timestamp: Date.now(),
      analysis: imageData.analysis
    });

    // Ограничиваем историю
    if (profile.imageHistory.length > 20) {
      profile.imageHistory = profile.imageHistory.slice(-10);
    }

    profile.updatedAt = Date.now();
  }

  /**
   * Получает рекомендации по согласованности
   */
  getConsistencyRecommendations(projectId) {
    if (!this.brandProfiles.has(projectId)) {
      return ['Создайте первое изображение для установления стиля бренда'];
    }

    const profile = this.brandProfiles.get(projectId);
    const recommendations = [];

    if (profile.colorPalette.length > 0) {
      recommendations.push(`Используйте фирменные цвета: ${profile.colorPalette.join(', ')}`);
    }

    if (profile.styleModifiers.length > 0) {
      recommendations.push('Поддерживайте установленный стиль оформления');
    }

    if (profile.imageHistory.length > 5) {
      recommendations.push('У вас достаточно изображений для анализа стиля');
    }

    return recommendations;
  }
}

/**
 * 🎯 ГЛАВНЫЙ ИНТЕЛЛЕКТУАЛЬНЫЙ УЛУЧШАТЕЛЬ
 * Координирует все компоненты для максимального улучшения Pollinations.ai
 */
class IntelligentPollinationsEnhancer {
  constructor() {
    this.styleAnalyzer = new StyleAnalyzer();
    this.colorSemantics = new ColorSemantics();
    this.compositionSemantics = new CompositionSemantics();
    this.intentionAnalyzer = new IntentionAnalyzer();
    this.styleTranslator = new StyleTranslator();
    this.qualityPredictor = new QualityPredictor();
    this.multiGenerator = new MultiGenerator();
    this.adaptiveParameters = new AdaptiveParameters();
    this.brandConsistency = new BrandConsistency();
    
    this.enhancementHistory = [];
    this.statistics = {
      totalEnhancements: 0,
      averageQualityImprovement: 0,
      successRate: 0
    };
  }

  /**
   * 🚀 ГЛАВНЫЙ МЕТОД: Полное интеллектуальное улучшение генерации
   */
  async enhanceImageGeneration(prompt, context = {}) {
    const enhancementStartTime = Date.now();
    
    try {
      console.log(`🧠 [ENHANCER] Запуск интеллектуального улучшения для: "${prompt.substring(0, 50)}..."`);

      // Этап 1: Глубокий анализ запроса
      const analysis = await this.performDeepAnalysis(prompt, context);
      
      // Этап 2: Применение брендинговой согласованности
      const consistentAnalysis = this.applyBrandingConsistency(analysis, context);
      
      // Этап 3: Создание оптимизированного промпта
      const optimizedPrompt = this.createOptimizedPrompt(prompt, consistentAnalysis);
      
      // Этап 4: Настройка адаптивных параметров
      const adaptiveParams = this.configureAdaptiveParameters(consistentAnalysis, context);
      
      // Этап 5: Предсказание качества
      const qualityPrediction = this.predictGenerationQuality(optimizedPrompt, consistentAnalysis);
      
      // Этап 6: Мульти-генерация с выбором лучшего
      const generationResult = await this.executeMultiGeneration(
        prompt, optimizedPrompt, adaptiveParams, context
      );
      
      // Этап 7: Постобработка и валидация
      const finalResult = await this.postProcessAndValidate(generationResult, consistentAnalysis);
      
      const processingTime = Date.now() - enhancementStartTime;
      
      // Обновление статистики и истории
      this.updateEnhancementHistory(prompt, finalResult, processingTime);
      
      const enhancementReport = {
        success: true,
        originalPrompt: prompt,
        enhancedPrompt: optimizedPrompt,
        analysis: consistentAnalysis,
        qualityPrediction,
        adaptiveParams,
        generationResult: finalResult,
        processingTime,
        
        // Метрики улучшения
        improvementMetrics: this.calculateImprovementMetrics(analysis, finalResult),
        
        // Рекомендации
        recommendations: this.generateEnhancementRecommendations(consistentAnalysis),
        
        // Отчет об использованных техниках
        techniquesUsed: this.getUsedTechniques(consistentAnalysis)
      };
      
      console.log(`✨ [ENHANCER] Улучшение завершено за ${processingTime}мс`);
      console.log(`🎯 [ENHANCER] Предсказанное качество: ${qualityPrediction.overallScore.toFixed(2)}/1.0`);
      
      return enhancementReport;
      
    } catch (error) {
      console.error(`❌ [ENHANCER] Ошибка интеллектуального улучшения:`, error);
      
      return {
        success: false,
        error: error.message,
        fallbackResult: await this.generateFallbackResult(prompt, context),
        processingTime: Date.now() - enhancementStartTime
      };
    }
  }

  /**
   * Выполняет глубокий анализ запроса
   */
  async performDeepAnalysis(prompt, context) {
    console.log(`🔍 [ENHANCER] Выполняю глубокий анализ запроса`);
    
    // Анализ намерений пользователя
    const intentionAnalysis = this.intentionAnalyzer.analyzeIntention(prompt, context);
    
    // Анализ стиля
    const styleAnalysis = this.styleAnalyzer.analyzeStyle(prompt, context);
    
    // Цветовая семантика
    const colorAnalysis = this.colorSemantics.analyzeColorNeeds(
      prompt, styleAnalysis.detectedStyle, context.emotionalContext
    );
    
    // Композиционная семантика
    const compositionAnalysis = this.compositionSemantics.analyzeComposition(
      prompt, styleAnalysis.detectedStyle, intentionAnalysis.primaryIntention
    );
    
    // Интеграция с визуальной семантикой
    let visualSemanticAnalysis = null;
    if (visualSemanticAnalyzer) {
      try {
        visualSemanticAnalysis = visualSemanticAnalyzer.analyzeVisualSemantics(prompt);
      } catch (e) {
        console.warn('⚠️ Визуальный семантический анализ недоступен');
      }
    }
    
    const analysis = {
      intentionAnalysis,
      styleAnalysis,
      colorAnalysis,
      compositionAnalysis,
      visualSemanticAnalysis,
      
      // Мета-информация
      analysisTimestamp: Date.now(),
      analysisConfidence: this.calculateOverallConfidence(
        intentionAnalysis, styleAnalysis, colorAnalysis, compositionAnalysis
      )
    };
    
    console.log(`✅ [ENHANCER] Анализ завершен. Уверенность: ${analysis.analysisConfidence.toFixed(2)}`);
    
    return analysis;
  }

  /**
   * Применяет брендинговую согласованность
   */
  applyBrandingConsistency(analysis, context) {
    if (!context.projectId) {
      return analysis; // без проекта нет брендинговой согласованности
    }
    
    console.log(`🏢 [ENHANCER] Применяю брендинговую согласованность для проекта ${context.projectId}`);
    
    return this.brandConsistency.applyBrandConsistency(context.projectId, analysis);
  }

  /**
   * Создает оптимизированный промпт
   */
  createOptimizedPrompt(originalPrompt, analysis) {
    console.log(`📝 [ENHANCER] Создаю оптимизированный промпт`);
    
    const optimizedPrompt = this.styleTranslator.translatePrompt(
      originalPrompt,
      analysis.styleAnalysis.detectedStyle,
      analysis.intentionAnalysis,
      analysis.colorAnalysis,
      analysis.compositionAnalysis
    );
    
    console.log(`✅ [ENHANCER] Промпт оптимизирован: "${optimizedPrompt.substring(0, 100)}..."`);
    
    return optimizedPrompt;
  }

  /**
   * Настраивает адаптивные параметры
   */
  configureAdaptiveParameters(analysis, context) {
    console.log(`🎛️ [ENHANCER] Настраиваю адаптивные параметры`);
    
    return this.adaptiveParameters.optimizeParameters(
      analysis.intentionAnalysis,
      analysis.styleAnalysis.detectedStyle,
      context
    );
  }

  /**
   * Предсказывает качество генерации
   */
  predictGenerationQuality(optimizedPrompt, analysis) {
    console.log(`🔮 [ENHANCER] Предсказываю качество генерации`);
    
    return this.qualityPredictor.predictQuality(
      optimizedPrompt,
      analysis.styleAnalysis.detectedStyle,
      analysis.intentionAnalysis,
      analysis.colorAnalysis,
      analysis.compositionAnalysis
    );
  }

  /**
   * Выполняет мульти-генерацию
   */
  async executeMultiGeneration(originalPrompt, optimizedPrompt, adaptiveParams, context) {
    console.log(`🔄 [ENHANCER] Выполняю мульти-генерацию`);
    
    const shouldUseMultiGeneration = context.prioritizeQuality || 
                                   adaptiveParams.quality === 'ultra' ||
                                   context.allowMultipleVariants;
    
    if (shouldUseMultiGeneration && !context.prioritizeSpeed) {
      // Мульти-генерация с выбором лучшего
      const variants = await this.multiGenerator.generateMultipleVariants(
        originalPrompt, optimizedPrompt, adaptiveParams.quality
      );
      
      const selection = this.multiGenerator.selectBestVariant(variants, {
        preferConservative: context.preferConservative,
        preferCreative: context.preferCreative,
        allowHighRisk: context.allowHighRisk
      });
      
      return {
        type: 'multi_generation',
        selectedVariant: selection.bestVariant,
        allVariants: selection.allVariants,
        selectionReasoning: selection.selectionReasoning,
        imageUrl: selection.bestVariant.imageUrl
      };
    } else {
      // Обычная генерация
      const { generateWithPollinations } = require('./ai-image-generator.js');
      const imageId = `enhanced_${Date.now()}`;
      const imageUrl = await generateWithPollinations(optimizedPrompt, imageId, adaptiveParams.quality);
      
      return {
        type: 'single_generation',
        imageUrl,
        prompt: optimizedPrompt,
        parameters: adaptiveParams
      };
    }
  }

  /**
   * Постобработка и валидация
   */
  async postProcessAndValidate(generationResult, analysis) {
    console.log(`🔧 [ENHANCER] Выполняю постобработку`);
    
    // Пока возвращаем результат как есть
    // В будущем здесь можно добавить AI-апскейлинг и улучшение
    
    const finalResult = {
      ...generationResult,
      validated: true,
      postProcessed: false, // пока не реализовано
      qualityScore: this.estimateImageQuality(generationResult, analysis)
    };
    
    return finalResult;
  }

  /**
   * Оценивает качество изображения
   */
  estimateImageQuality(generationResult, analysis) {
    // Упрощенная оценка на основе использованных техник
    let qualityScore = 0.6; // базовая оценка
    
    if (generationResult.type === 'multi_generation') {
      qualityScore += 0.2; // бонус за мульти-генерацию
    }
    
    if (analysis.analysisConfidence > 0.8) {
      qualityScore += 0.1; // бонус за высокую уверенность анализа
    }
    
    if (analysis.styleAnalysis.confidence > 0.7) {
      qualityScore += 0.1; // бонус за правильно определенный стиль
    }
    
    return Math.min(1.0, qualityScore);
  }

  /**
   * Вычисляет общую уверенность анализа
   */
  calculateOverallConfidence(intentionAnalysis, styleAnalysis, colorAnalysis, compositionAnalysis) {
    const confidences = [
      intentionAnalysis.confidence,
      styleAnalysis.confidence,
      0.7, // фиксированная уверенность для цветового анализа
      0.6  // фиксированная уверенность для композиционного анализа
    ];
    
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  }

  /**
   * Вычисляет метрики улучшения
   */
  calculateImprovementMetrics(analysis, finalResult) {
    return {
      promptEnhancement: {
        originalLength: analysis.originalPrompt?.length || 0,
        enhancedLength: finalResult.prompt?.length || 0,
        modifiersAdded: analysis.styleAnalysis.appliedModifiers.length
      },
      qualityPrediction: {
        predictedScore: analysis.qualityPrediction?.overallScore || 0.5,
        actualScore: finalResult.qualityScore || 0.5
      },
      technicalOptimization: {
        parametersOptimized: true,
        multiGenerationUsed: finalResult.type === 'multi_generation',
        brandConsistencyApplied: !!analysis.brandConsistency
      }
    };
  }

  /**
   * Генерирует рекомендации по улучшению
   */
  generateEnhancementRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.analysisConfidence < 0.7) {
      recommendations.push('Добавьте больше деталей в описание для лучшего анализа');
    }
    
    if (analysis.styleAnalysis.confidence < 0.6) {
      recommendations.push('Уточните желаемый стиль изображения');
    }
    
    if (analysis.colorAnalysis.recommendedPalette.length === 0) {
      recommendations.push('Укажите предпочтительные цвета');
    }
    
    if (!analysis.visualSemanticAnalysis) {
      recommendations.push('Визуальный семантический анализ недоступен - рассмотрите интеграцию');
    }
    
    return recommendations;
  }

  /**
   * Возвращает использованные техники
   */
  getUsedTechniques(analysis) {
    const techniques = [];
    
    techniques.push('Анализ намерений пользователя');
    techniques.push('Автоматическое определение стиля');
    techniques.push('Цветовая семантика');
    techniques.push('Композиционная семантика');
    techniques.push('Промпт-инжиниринг');
    techniques.push('Адаптивные параметры');
    
    if (analysis.visualSemanticAnalysis) {
      techniques.push('Визуальный семантический анализ');
    }
    
    return techniques;
  }

  /**
   * Обновляет историю улучшений
   */
  updateEnhancementHistory(prompt, result, processingTime) {
    this.enhancementHistory.push({
      prompt: prompt.substring(0, 100),
      success: result.success || true,
      processingTime,
      qualityScore: result.qualityScore || 0.5,
      timestamp: Date.now()
    });
    
    // Ограничиваем историю
    if (this.enhancementHistory.length > 100) {
      this.enhancementHistory = this.enhancementHistory.slice(-50);
    }
    
    // Обновляем статистику
    this.updateStatistics();
  }

  /**
   * Обновляет статистику системы
   */
  updateStatistics() {
    this.statistics.totalEnhancements = this.enhancementHistory.length;
    
    if (this.enhancementHistory.length > 0) {
      this.statistics.averageQualityImprovement = 
        this.enhancementHistory.reduce((sum, item) => sum + item.qualityScore, 0) / 
        this.enhancementHistory.length;
      
      this.statistics.successRate = 
        this.enhancementHistory.filter(item => item.success).length / 
        this.enhancementHistory.length;
    }
  }

  /**
   * Генерирует резервный результат
   */
  async generateFallbackResult(prompt, context) {
    console.log(`🔄 [ENHANCER] Генерирую резервный результат`);
    
    try {
      const { generateWithPollinations } = require('./ai-image-generator.js');
      const fallbackId = `fallback_${Date.now()}`;
      const imageUrl = await generateWithPollinations(prompt, fallbackId, 'standard');
      
      return {
        type: 'fallback',
        imageUrl,
        prompt,
        message: 'Использован базовый режим генерации'
      };
    } catch (error) {
      return {
        type: 'error',
        message: 'Не удалось сгенерировать изображение',
        error: error.message
      };
    }
  }

  /**
   * Получает статистику системы
   */
  getSystemStatistics() {
    return {
      ...this.statistics,
      historySize: this.enhancementHistory.length,
      componentsStatus: {
        styleAnalyzer: 'active',
        colorSemantics: 'active',
        compositionSemantics: 'active',
        intentionAnalyzer: 'active',
        styleTranslator: 'active',
        qualityPredictor: 'active',
        multiGenerator: 'active',
        adaptiveParameters: 'active',
        brandConsistency: 'active',
        visualSemanticAnalyzer: visualSemanticAnalyzer ? 'active' : 'unavailable'
      }
    };
  }
}

// Создаем глобальный экземпляр улучшателя
const intelligentPollinationsEnhancer = new IntelligentPollinationsEnhancer();

module.exports = {
  // Основной метод улучшения
  enhanceImageGeneration: intelligentPollinationsEnhancer.enhanceImageGeneration.bind(intelligentPollinationsEnhancer),
  
  // Статистика
  getSystemStatistics: intelligentPollinationsEnhancer.getSystemStatistics.bind(intelligentPollinationsEnhancer),
  
  // Доступ к отдельным компонентам
  components: {
    styleAnalyzer: intelligentPollinationsEnhancer.styleAnalyzer,
    colorSemantics: intelligentPollinationsEnhancer.colorSemantics,
    compositionSemantics: intelligentPollinationsEnhancer.compositionSemantics,
    intentionAnalyzer: intelligentPollinationsEnhancer.intentionAnalyzer,
    styleTranslator: intelligentPollinationsEnhancer.styleTranslator,
    qualityPredictor: intelligentPollinationsEnhancer.qualityPredictor,
    multiGenerator: intelligentPollinationsEnhancer.multiGenerator,
    adaptiveParameters: intelligentPollinationsEnhancer.adaptiveParameters,
    brandConsistency: intelligentPollinationsEnhancer.brandConsistency
  },
  
  // Классы для расширения
  IntelligentPollinationsEnhancer,
  StyleAnalyzer,
  ColorSemantics,
  CompositionSemantics,
  IntentionAnalyzer,
  StyleTranslator,
  QualityPredictor,
  MultiGenerator,
  AdaptiveParameters,
  BrandConsistency
};
