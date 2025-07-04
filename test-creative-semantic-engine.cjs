
/**
 * ТЕСТ КРЕАТИВНОГО СЕМАНТИЧЕСКОГО ДВИЖКА
 * Демонстрация генерации принципиально новых концепций
 */

const { processCreativeRequest, getSystemStatistics } = require('./server/semantic-memory/creative-semantic-engine.cjs');

async function testCreativeEngine() {
  console.log('🎨🧠 ===== ТЕСТ КРЕАТИВНОГО СЕМАНТИЧЕСКОГО ДВИЖКА =====\n');

  // Тест 1: Простой креативный запрос
  console.log('📝 ТЕСТ 1: Простой креативный запрос');
  const result1 = await processCreativeRequest(
    'Создай что-то удивительное и необычное',
    { hasRecentImages: false }
  );
  
  console.log('✨ Результат:');
  console.log(`   Оценка креативности: ${result1.creativityScore}/10`);
  console.log(`   Оценка новизны: ${result1.noveltyScore}/10`);
  console.log(`   Базовых идей: ${result1.baseIdeas.length}`);
  console.log(`   Гибридов: ${result1.hybrids.length}`);
  console.log(`   Новых концепций: ${result1.novelConcepts.length}\n`);

  // Тест 2: Абстрактный запрос
  console.log('📝 ТЕСТ 2: Абстрактный запрос');
  const result2 = await processCreativeRequest(
    'Придумай абстрактную концепцию, которая объединяет время, пространство и эмоции',
    { hasRecentImages: true }
  );
  
  console.log('✨ Результат:');
  console.log(`   Креативный потенциал: ${result2.creativePotential.level.toFixed(2)}`);
  console.log(`   Уровень инноваций: ${result2.creativeResult.innovationLevel}`);
  console.log(`   Креативное разнообразие: ${result2.creativeResult.creativeDiversity.toFixed(2)}`);
  console.log(`   Эмерджентные свойства: ${result2.creativeResult.emergentProperties.join(', ')}\n`);

  // Тест 3: Технический креативный запрос
  console.log('📝 ТЕСТ 3: Технический креативный запрос');
  const result3 = await processCreativeRequest(
    'Изобрети революционный алгоритм для обработки изображений',
    { sessionCount: 10 }
  );
  
  console.log('✨ Результат:');
  console.log(`   Время обработки: ${result3.processingTime}мс`);
  console.log(`   Топ креативных идей: ${result3.creativeResult.topCreativeIdeas.length}`);
  console.log(`   Качество синтеза: ${result3.creativeResult.synthesisQuality.toFixed(2)}`);
  console.log(`   Эволюция поколений: ${result3.evolutionResult.generations}\n`);

  // Статистика системы
  console.log('📊 СТАТИСТИКА СИСТЕМЫ:');
  const stats = getSystemStatistics();
  console.log(`   Идей сгенерировано: ${stats.ideasGenerated}`);
  console.log(`   Гибридов создано: ${stats.hybridsCreated}`);
  console.log(`   Новых концепций: ${stats.novelConceptsCreated}`);
  console.log(`   Циклов эволюции: ${stats.evolutionCycles}`);
  console.log(`   Библиотека идей: ${stats.ideaLibrarySize}`);
  console.log(`   Креативных сессий: ${stats.creativeSessions}`);
  
  console.log('\n🎯 КРЕАТИВНЫЙ СЕМАНТИЧЕСКИЙ ДВИЖОК ПРОТЕСТИРОВАН УСПЕШНО! 🎨✨');
}

testCreativeEngine().catch(console.error);
