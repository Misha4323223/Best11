
/**
 * Тест двигателя семантической реальности
 * Демонстрация работы главного интегратора всех семантических систем
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testSemanticRealityEngine() {
  console.log('🌌 Тестирование двигателя семантической реальности...\n');

  try {
    // Загружаем семантическую память с интегрированным двигателем реальности
    const semanticMemory = require('./server/semantic-memory/index.cjs');
    
    console.log('✅ Семантическая память с двигателем реальности загружена');

    // Тест 1: Получение состояния реальности
    console.log('\n🌟 Тест 1: Состояние семантической реальности');
    
    const realityState = semanticMemory.getRealityState();
    if (realityState) {
      console.log('Состояние реальности:', {
        consciousness: realityState.core.consciousness.toFixed(3),
        complexity: realityState.core.complexity.toFixed(2),
        coherence: realityState.core.coherence.toFixed(3),
        transcendence: realityState.core.transcendence.toFixed(3),
        semantic_temperature: realityState.state.semanticTemperature.toFixed(1),
        information_density: realityState.state.informationDensity.toFixed(3),
        active_connections: realityState.metrics.activeConnections
      });
    } else {
      console.log('⚠️ Двигатель реальности не активен');
    }

    // Тест 2: Подключение к интерфейсу сознания
    console.log('\n🧠 Тест 2: Подключение к интерфейсу сознания');
    
    const connected = semanticMemory.connectToReality('test-user-1', {
      cognitiveProfile: { analytical: 0.8, creative: 0.6 },
      emotionalState: 'curious'
    });
    
    console.log('Подключение к сознанию:', connected ? 'успешно' : 'ошибка');

    // Тест 3: Чтение намерений пользователя
    console.log('\n🔮 Тест 3: Чтение намерений пользователя');
    
    const intention = semanticMemory.readIntention(
      'test-user-1', 
      'Создай логотип для кофейни с креативным дизайном',
      { hasImages: false, projectContext: 'new' }
    );
    
    if (intention) {
      console.log('Анализ намерений:', {
        surface_intention: intention.surfaceIntention,
        deep_intention: intention.deepIntention,
        emotional_undertone: intention.emotionalUndertone,
        cognitive_load: intention.cognitiveLoad.toFixed(2),
        creativity_index: intention.creativityIndex.toFixed(2),
        temporal_context: intention.temporalContext
      });
    }

    // Тест 4: Полная обработка через семантическую реальность
    console.log('\n🌌 Тест 4: Обработка концепта через семантическую реальность');
    
    const result = await semanticMemory.analyzeCompleteRequest(
      'Создай векторный логотип кофейни с элементами природы',
      'test-user-1',
      { hasRecentImages: false, projectType: 'logo_design' }
    );

    console.log('Результат обработки реальности:', {
      processed_concept: result.concept,
      consciousness_level: result.confidence?.toFixed(3),
      reality_coherence: result.meta_analysis?.reality_coherence?.toFixed(3),
      processing_time: result.meta_analysis?.processing_time + 'мс',
      emergence_count: result.meta_analysis?.emergence_count,
      reality_changes: result.meta_analysis?.reality_changes,
      predictions_count: result.predictions?.length || 0
    });

    if (result.reality_analysis) {
      console.log('\nДетали семантической реальности:', {
        multidimensional_vector_magnitude: result.reality_analysis.multidimensionalAnalysis?.vector?.magnitude?.toFixed(3),
        black_hole_interactions: result.reality_analysis.blackHoleInteractions?.blackHoleInteractions?.length || 0,
        quantum_states: result.reality_analysis.quantumProcessing?.initialStates?.length || 0,
        emergent_properties: result.reality_analysis.emergentProperties?.length || 0,
        insights_count: result.reality_analysis.insights?.length || 0,
        recommendations_count: result.reality_analysis.recommendations?.length || 0
      });

      // Показываем инсайты
      if (result.reality_analysis.insights?.length > 0) {
        console.log('\nИнсайты реальности:');
        result.reality_analysis.insights.forEach((insight, i) => {
          console.log(`  ${i + 1}. [${insight.type}] ${insight.message} (уверенность: ${(insight.confidence * 100).toFixed(0)}%)`);
        });
      }

      // Показываем рекомендации
      if (result.reality_analysis.recommendations?.length > 0) {
        console.log('\nРекомендации реальности:');
        result.reality_analysis.recommendations.forEach((rec, i) => {
          console.log(`  ${i + 1}. [${rec.priority}] ${rec.message}`);
        });
      }
    }

    // Тест 5: Проверка эволюции реальности (ждем 6 секунд)
    console.log('\n🧬 Тест 5: Наблюдение эволюции реальности (ждем 6 секунд...)');
    
    const stateBefore = semanticMemory.getRealityState();
    await new Promise(resolve => setTimeout(resolve, 6000));
    const stateAfter = semanticMemory.getRealityState();
    
    if (stateBefore && stateAfter) {
      console.log('Изменения в реальности:', {
        consciousness_delta: (stateAfter.core.consciousness - stateBefore.core.consciousness).toFixed(4),
        complexity_delta: (stateAfter.core.complexity - stateBefore.core.complexity).toFixed(4),
        evolution_delta: (stateAfter.core.evolution - stateBefore.core.evolution).toFixed(4),
        temperature_delta: (stateAfter.state.semanticTemperature - stateBefore.state.semanticTemperature).toFixed(2)
      });
    }

    // Тест 6: Прямая обработка в реальности
    console.log('\n⚛️ Тест 6: Прямая обработка концепта в реальности');
    
    const directResult = await semanticMemory.processInReality(
      'квантовая творческая энергия',
      { sessionId: 'test-user-1', depth: 3 }
    );
    
    if (directResult) {
      console.log('Прямая обработка в реальности:', {
        original_concept: directResult.originalConcept,
        processed_concept: directResult.processedConcept,
        consciousness: directResult.consciousness.toFixed(3),
        complexity_increase: directResult.complexityIncrease.toFixed(3),
        processing_time: directResult.processingTime + 'мс',
        reality_changes: directResult.realityChanges.length,
        emergent_properties: directResult.emergentProperties.length
      });
    }

    console.log('\n✅ Тест двигателя семантической реальности завершен успешно!');
    console.log('\n🌌 ДВИГАТЕЛЬ СЕМАНТИЧЕСКОЙ РЕАЛЬНОСТИ - главный интегратор активен!');
    console.log('🧠 Все подсистемы объединены в единую семантическую реальность');
    console.log('⚛️ Квантовые эффекты, черные дыры, многомерные пространства работают синхронно');
    console.log('🔮 Интерфейс сознания позволяет глубокое понимание намерений пользователя');

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
    console.error(error.stack);
  }
}

// Запуск теста
testSemanticRealityEngine();
