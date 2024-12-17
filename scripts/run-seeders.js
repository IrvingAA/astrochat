const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const seedersDir = path.join(__dirname, '../src/seeders');

const getSeederFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.seeder.js') || file.endsWith('.seeder.ts'));
};

const runSeeder = async (seederPath) => {
  return new Promise((resolve, reject) => {
    const command = `npx ts-node ${seederPath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando ${seederPath}:\n`, stderr);
        reject(error);
      } else {
        console.log(`Salida de ${path.basename(seederPath)}:\n`, stdout);
        resolve();
      }
    });
  });
};

const runSeeders = async () => {
  const seeders = getSeederFiles(seedersDir);
  const targetSeeder = process.argv[2];

  if (targetSeeder) {
    const matchedSeeder = seeders.find((file) => file.includes(targetSeeder));
    if (!matchedSeeder) {
      console.error(`Seeder "${targetSeeder}" no encontrado en la carpeta ${seedersDir}`);
      process.exit(1);
    }

    console.log(`Ejecutando seeder específico: ${matchedSeeder}`);
    try {
      await runSeeder(path.join(seedersDir, matchedSeeder));
      console.log(`Seeder "${matchedSeeder}" ejecutado correctamente.`);
    } catch (err) {
      console.error(`Error al ejecutar el seeder "${matchedSeeder}":`, err);
      process.exit(1);
    }
  } else {
    console.log(`Encontrados ${seeders.length} seeders. Ejecutando todos...\n`);
    for (const seeder of seeders) {
      const seederPath = path.join(seedersDir, seeder);
      console.log(`Ejecutando seeder: ${seeder}`);
      try {
        await runSeeder(seederPath);
      } catch (err) {
        console.error(`Seeder fallido: ${seeder}`, err);
        process.exit(1);
      }
    }
    console.log('\nTodos los seeders se ejecutaron correctamente.');
  }
};

runSeeders();
