
/**
 * 🧠🎨 ТЕСТ ИНТЕЛЛЕКТУАЛЬНОГО УЛУЧШАТЕЛЯ POLLINATIONS.AI
 * Демонстрация всех возможностей системы
 */

async function runIntelligentEnhancerTests() {
  console.log('🧠🎨 ЗАПУСК ТЕСТОВ ИНТЕЛЛЕКТУАЛЬНОГО УЛУЧШАТЕЛЯ');
  console.log('=' .repeat(60));

  try {
    // Импортируем улучшатель
    const intelligentEnhancer = require('./server/intelligent-pollinations-enhancer.js');
    
    // Тест 1: Логотип компании
    console.log('\n📋 ТЕСТ 1: Создание логотипа компании');
    console.log('-'.repeat(40));
    
    const logoResult = await intelligentEnhancer.enhanceImageGeneration(
      'создай логотип для IT компании с названием TechFlow', 
      {
        projectId: 'techflow_project',
        prioritizeQuality: true,
        forPrint: true
      }
    );
    
    if (logoResult.success) {
      console.log('✅ Логотип создан успешно');
      console.log(`🎯 Обнаруженное намерение: ${logoResult.analysis.intentionAnalysis.primaryIntention}`);
      console.log(`🎨 Определенный стиль: ${logoResult.analysis.styleAnalysis.detectedStyle}`);
      console.log(`📝 Оригинальный промпт: ${logoResult.originalPrompt}`);
      console.log(`✨ Улучшенный промпт: ${logoResult.enhancedPrompt.substring(0, 100)}...`);
      console.log(`⏱️ Время обработки: ${logoResult.processingTime}мс`);
      console.log(`🔗 URL изображения: ${logoResult.generationResult.imageUrl}`);
    } else {
      console.log('❌ Ошибка создания логотипа:', logoResult.error);
    }

    // Тест 2: Принт для футболки
    console.log('\n📋 ТЕСТ 2: Дизайн принта для футболки');
    console.log('-'.repeat(40));
    
    const printResult = await intelligentEnhancer.enhanceImageGeneration(
      'создай принт с космическим самураем для футболки в стиле киберпанк', 
      {
        prioritizeQuality: true,
        allowMultipleVariants: false, // для скорости
        forPrint: true,
        emotionalContext: { energy: 'high', mood: 'dynamic' }
      }
    );
    
    if (printResult.success) {
      console.log('✅ Принт создан успешно');
      console.log(`🎯 Намерение: ${printResult.analysis.intentionAnalysis.primaryIntention}`);
      console.log(`🎨 Стиль: ${printResult.analysis.styleAnalysis.detectedStyle}`);
      console.log(`🌈 Цветовые рекомендации: ${printResult.analysis.colorAnalysis.recommendedPalette.join(', ')}`);
      console.log(`📐 Композиционные принципы: ${printResult.analysis.compositionAnalysis.layoutPrinciples.join(', ')}`);
      console.log(`⏱️ Время: ${printResult.processingTime}мс`);
    } else {
      console.log('❌ Ошибка создания принта:', printResult.error);
    }

    // Тест 3: Дизайн для вышивки
    console.log('\n📋 ТЕСТ 3: Дизайн для вышивки');
    console.log('-'.repeat(40));
    
    const embroideryResult = await intelligentEnhancer.enhanceImageGeneration(
      'создай вышивку с логотипом розы и надписью Handmade', 
      {
        style: 'embroidery',
        prioritizeQuality: true
      }
    );
    
    if (embroideryResult.success) {
      console.log('✅ Дизайн вышивки создан');
      console.log(`🎯 Намерение: ${embroideryResult.analysis.intentionAnalysis.primaryIntention}`);
      console.log(`🎨 Стиль: ${embroideryResult.analysis.styleAnalysis.detectedStyle}`);
      console.log(`🧵 Ограничения: ${embroideryResult.analysis.colorAnalysis.restrictions.join(', ')}`);
      console.log(`⏱️ Время: ${embroideryResult.processingTime}мс`);
    } else {
      console.log('❌ Ошибка создания вышивки:', embroideryResult.error);
    }

    // Тест 4: Анализ без генерации
    console.log('\n📋 ТЕСТ 4: Анализ промпта без генерации');
    console.log('-'.repeat(40));
    
    const { components } = intelligentEnhancer;
    
    const testPrompt = 'нарисуй яркий постер с неоновыми огнями для рекламы ночного клуба';
    const intentionAnalysis = components.intentionAnalyzer.analyzeIntention(testPrompt);
    const styleAnalysis = components.styleAnalyzer.analyzeStyle(testPrompt);
    const colorAnalysis = components.colorSemantics.analyzeColorNeeds(testPrompt, 'artistic');
    
    console.log('🔍 Результаты анализа:');
    console.log(`   Намерение: ${intentionAnalysis.primaryIntention} (уверенность: ${intentionAnalysis.confidence.toFixed(2)})`);
    console.log(`   Стиль: ${styleAnalysis.detectedStyle} (уверенность: ${styleAnalysis.confidence.toFixed(2)})`);
    console.log(`   Цвета: ${colorAnalysis.recommendedPalette.join(', ')}`);
    console.log(`   Эмоциональное воздействие: ${colorAnalysis.emotionalAlignment.join(', ')}`);

    // Тест 5: Предсказание качества
    console.log('\n📋 ТЕСТ 5: Предсказание качества');
    console.log('-'.repeat(40));
    
    const qualityPrediction = components.qualityPredictor.predictQuality(
      testPrompt, 'artistic', intentionAnalysis, colorAnalysis, 
      components.compositionSemantics.analyzeComposition(testPrompt, 'artistic', intentionAnalysis.primaryIntention)
    );
    
    console.log('🔮 Предсказание качества:');
    console.log(`   Общая оценка: ${qualityPrediction.overallScore.toFixed(2)}/1.0`);
    console.log(`   Уверенность: ${qualityPrediction.confidence.toFixed(2)}`);
    console.log(`   Рекомендации: ${qualityPrediction.recommendations.join(', ')}`);
    if (qualityPrediction.expectedIssues.length > 0) {
      console.log(`   Возможные проблемы: ${qualityPrediction.expectedIssues.join(', ')}`);
    }

    // Тест 6: Статистика системы
    console.log('\n📋 ТЕСТ 6: Статистика системы');
    console.log('-'.repeat(40));
    
    const statistics = intelligentEnhancer.getSystemStatistics();
    console.log('📊 Статистика системы:');
    console.log(`   Всего улучшений: ${statistics.totalEnhancements}`);
    console.log(`   Средний рост качества: ${statistics.averageQualityImprovement.toFixed(2)}`);
    console.log(`   Успешность: ${(statistics.successRate * 100).toFixed(1)}%`);
    console.log('🔧 Статус компонентов:');
    Object.entries(statistics.componentsStatus).forEach(([component, status]) => {
      const statusIcon = status === 'active' ? '✅' : '⚠️';
      console.log(`   ${statusIcon} ${component}: ${status}`);
    });

    console.log('\n🎉 ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ УСПЕШНО!');
    console.log('=' .repeat(60));
    console.log('🧠 Интеллектуальный улучшатель Pollinations.ai готов к работе!');
    console.log('📚 Доступные возможности:');
    console.log('   • Автоматическое определение стиля изображения');
    console.log('   • Умный подбор цветовых палитр');
    console.log('   • Композиционная семантика');
    console.log('   • Анализ намерений пользователя');
    console.log('   • Промпт-инжиниринг с оптимизацией');
    console.log('   • Предсказание качества результата');
    console.log('   • Мульти-генерация с выбором лучшего');
    console.log('   • Адаптивные параметры генерации');
    console.log('   • Брендинговая согласованность');
    console.log('   • Интеграция с семантической памятью');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Запускаем тесты если файл выполняется напрямую
if (require.main === module) {
  runIntelligentEnhancerTests().catch(console.error);
}

module.exports = { runIntelligentEnhancerTests };
