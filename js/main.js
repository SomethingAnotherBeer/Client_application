
const request = new XMLHttpRequest();
const request_form = document.querySelector('.request-form');
const post_button = document.getElementById('send-post');
const get_button = document.getElementById('send-get');

let post_response = ''; //Ответ для POST запроса
let get_response = null; // Ответ для GET запроса
let prepared_get = []; //Преобразованный в массив коллекций ответ для GET запроса
let list = null; //Создаваемый в документе список для отображения результатов GET запроса 
let data = { 
		'messages':[
			{
				'message':'Должны же',
				'phone':+79999978,
			},

			{
				'message':'Не должны',
				'phone':+79999977,
			},
		],
	}; // Объект с передаваемыми параметрами для POST запроса

post_button.addEventListener('click',()=>{ // Событие по клику для отправки post запроса

	request.addEventListener('readystatechange',()=>{
		if(request.readyState == 4 && request.status == 200){
			post_response = JSON.parse(request.response);
			console.log(post_response);
		}
	})


	request.open('POST','http://testserver1/api/webhook');
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.send('messages='+JSON.stringify(data));
})

get_button.addEventListener('click',()=>{ // Событие по клику для отправки get запроса
	request.addEventListener('readystatechange',()=>{
		if(request.readyState == 4 && request.status == 200){
			get_response = JSON.parse(request.response);
			if(Array.isArray(get_response)){ 
				prepared_get = prepareGetRequest(get_response); //Преобразуем массив объектов в массив коллекций
				list = createGetList(); //Создаем в документе список для отображения
				request_form.after(list); //Добавляем созданный ранее список после формы с кнопками
				writeGetList(); //Записываем преобразованный ранее массив ответа в документ
				
			}
		}
	})

	request.open('GET','http://testserver1/api/messages');
	request.send();
})


function prepareGetRequest(getresponse){ //Перевод массив объектов в массив коллекций
	let getprepared = [];
	let item = '';
	for(let obj of getresponse){
		item = new Map(Object.entries(obj));
		getprepared.push(item);
	}
	return getprepared;

}

function createGetList(){ //Создание списка для вывода резульата запроса GET
	let list = document.createElement('ul');
	list.className = 'get-list';
	return list;
}

function writeGetList(){ // Запись результата в ранее созданный список
	for(let item of prepared_get){
		let list_item = document.createElement('li');
		list.append(list_item);
		item.forEach((value,key)=>{
			list_item.innerHTML+= key+ ": "+value+'<br/>';
		})
		


	}


}

