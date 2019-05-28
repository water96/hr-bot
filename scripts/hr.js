
module.exports = (robot) => {
	function create_excel() {
		// Require library
		var excel = require('excel4node');

		// Create a new instance of a Workbook class
		var workbook = new excel.Workbook();

		// Add Worksheets to the workbook
		var worksheet = workbook.addWorksheet('Sheet 1');
		//var worksheet2 = workbook.addWorksheet('Sheet 2');

		// Create a reusable style
		var style = workbook.createStyle({
		  font: {
		    color: '#000000',
		    size: 12
		  },
		  numberFormat: '$#,##0.00; ($#,##0.00); -'
		});


		console.log(surveys);
		console.log(questions);

		let users = Object.keys(surveys);

		questions.forEach((q, i) => {
			console.log(q.question);
			worksheet.cell(i + 2, 1).string(q.question).style(style);
		});


		users.forEach((user, i) => {
			console.log(user);
			worksheet.cell(1, i + 2).string(user).style(style);
			surveys[user].answers.forEach((a, j) => {
				worksheet.cell(j + 2, i + 2).string(`${a.toString()}. ${questions[j].answers[a - 1]}`).style(style);
			});	
		});	

		workbook.write('/home/aleksey/Public/case/Excel.xlsx');
	}

	//console.log(robot);

	let questions = [
		{
			question: 'Нравится ли Вам чемпионат CASE-IN?',
			answers: [
				'Да',
				'Очень',
				'Чётко',
				'Нормально',
			],
		},
		{
			question: 'Crazу Atom лучшая команда?',
			answers: [
				'Да',
				'Определенно, да',
			],
		},
		{
			question: 'Росатом лучший работодатель',
			answers: [
				'Да',
				'Конечно да',
				'Спрашиваете еще...',
			],
		},
		{
			question: 'Политех лучше всех?',
			answers: [
				'Политех ждет успех',
				'Политех лучше всех!',
			],
		},
		{
			question: 'На сколько Вы оцениваете выступление команды Crazy Atom?',
			answers: [
				'Великолепно',
				'Необыкновенно',
				'Оригинально',
				'Высокотехнологично',
				'Всё сразу',
			],
		},
	];

	let surveys = {};

	function getSurvey() {
		return {
			currectQuestion: 0,
			answers: [],
			done: 0,
		};
	}

	robot.respond(/начальник/gi, (res) => 
	{
		var msg = {};
		
		console.log(res);

		msg.attachments = [
			{
				title: "Иван Петрович\nБюро №13",
				title_link_download: true,
				text: "ivan.petrovich@rosatom.ru\n+79129129121",
				image_url: "https://imgflip.com/s/meme/Futurama-Fry.jpg"
			}
		];
	
		robot.messageRoom(res.message.room, msg);
	}
	);




	robot.respond(/(what time is it|what's the time)/gi, (res) => {
		const d = new Date()
		const t = `${d.getHours()}:${d.getMinutes()} and ${d.getSeconds()} seconds`
		res.reply(`It's ${t}`)
	})

	robot.respond(/(Где я работаю\?|Че ваще\?)/gi, (res) => {
		res.reply(`росатом`);
	})

	robot.respond(/Анкета/gi, (res) => {

		let user = res.message.user.name;

		console.log(res.message.user.name);
		surveys[user] = getSurvey();
		let survey = surveys[user];
		survey.currectQuestion = 0;
		survey.done = 0;

		let answers = questions[0].answers.reduce((answers, answer) => {
			return `${answers} "${answer}"`;
		}, '');

		res.reply(`!poll "${questions[0].question}" ${answers}`);

	});

	robot.respond(/\d/gi, (res) => {

		let user = res.message.user.name;
		let survey = surveys[user];

		if (!survey) {
			return res.reply('Не могу распознать(');
		}

		if(survey.done)
		{
			return;
		}

		function getQuestion(current) {

			let question = questions[current].question;

			let answers = questions[current].answers.reduce((answers, answer) => {
				return `${answers} "${answer}"`;
			}, '');

			return `!poll "${question}" ${answers}`;
		}

		let answer = parseInt(res.message.text.slice(6));
		let numberAnswers = questions[survey.currectQuestion].answers.length;

		if (!isNaN(answer) && answer >= 1 && answer <= numberAnswers) {
			survey.answers.push(answer);

			if (survey.currectQuestion >= questions.length-1) {
				console.log(surveys);
				survey.done = 1;
				create_excel();
				res.reply(`Спасибо, ${user}. Ваши ответы: ${survey.answers}`);
				return;
			}

		} else {
			return res.reply(getQuestion(survey.currectQuestion));
		}

		return res.reply(getQuestion(++survey.currectQuestion));
	});
}

