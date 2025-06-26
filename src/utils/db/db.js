import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');

function generateRandomData(count) {
  const hobbies = ['football', 'reading', 'gaming', 'cooking', 'hiking'];
  const professionals = ['frontend', 'backend', 'designer', 'devops', 'manager'];
  const interests = ['AI', 'Blockchain', 'Psychology', 'Music', 'Astronomy', 'Photography'];

  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      fullname: `User ${i + 1}`,
      hobbies: hobbies[Math.floor(Math.random() * hobbies.length)],
      professional: professionals[Math.floor(Math.random() * professionals.length)],
      interests: interests[Math.floor(Math.random() * interests.length)], // ✅ جدید
      similarPercentage: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
      icon: `/photos/Group-${i + 1}.svg`,
      logo: `/photos/Group-${i + 1}.svg`,
      isSimilar: Math.random() > 0.5,
      connectionStatus: 'connect', // 🟢 حالت پیش‌فرض
    });
  }

  return data;
}



function initJsonFile() {
  if (!fs.existsSync(dataPath)) {
    const data = generateRandomData(12);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

function readJsonData() {
  const file = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(file);
}

// سیارات بر اساس شباهت: ۳ تای بالا ثابت، بقیه رندوم
function getPlanetsForUI() {
  const allData = readJsonData();
  const sorted = allData.sort((a, b) => b.similarPercentage - a.similarPercentage);

  const fixedPlanets = sorted.slice(0, 3);
  const randomPlanets = sorted.slice(3);

  const fixed = fixedPlanets.map((user, idx) => ({
    x: [`30%`, `60%`, `45%`][idx],
    y: [`30%`, `50%`, `70%`][idx],
    hasLine: true,
    user,
  }));
  

  const random = randomPlanets.map(user => ({
    x: `${Math.floor(Math.random() * 80) + 10}%`,  // بین 10% تا 90%
    y: `${Math.floor(Math.random() * 80) + 10}%`,  // بین 10% تا 90%
    hasLine: false,
    user,
  }));
  
  return [...fixed, ...random];
}

// اجرا هنگام import اولیه
initJsonFile();

export { readJsonData, getPlanetsForUI };
