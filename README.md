# xhres6
XMLHttpRequest ES6 Promise

options

```sh
	method:"POST || GET || HEAD || DELETE || PUT",
	headers:{
		'XX':'XX'
	},
	data:{
		'XX':'XX'
	},
	data_type:'raw || form-data || json', defualt 'raw'
	async:true || false, defualt true
	url:'/',
	timeout:10000
```

simple demo

```sh
const xhr = new xhres6;

xhr.get('/Api/getArray').then(function(_rpdata){
	console.log(_rpdata);
	const { headers, body, xhr_status, xhr} = _rpdata;
	// body this is server response data;
});

```

form-data demo

```sh
function Base64Image(file) {
	const reader = new FileReader();
	
	reader.onload = (e) => {
		this.newlist=[reader.result, ...this.newlist];
	};
	reader.readAsDataURL(file);
};

function blobImage(file){
	try(URL){
		return URL.createObjectURL(file);
	}catch(e){
		console.log('您的浏览器不支持预览');
	}
}

function dataURItoBlob(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	let byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0){
		byteString = atob(dataURI.split(',')[1]);
	}else{
		byteString = unescape(dataURI.split(',')[1]);
	}
	// separate out the mime component
	let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	let ia = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}

const fd = new FormData();
fd.append('pages', 3);
// if you have file to upload
const base64_image_string = Base64Image(file);
fd.append('file', dataURItoBlob(base64_image_string));
const xhr = new xhres6;

xhr.put('/Api',{
	headers:{
		token : window.localStorage.token
	},
	data_type:'form-data',
	data:fd
}).then(function(_rpdata){
	console.log(_rpdata);
	const { headers, body, xhr_status, xhr} = _rpdata;
	// body this is server response data;
});

```

return xhr handler demo

```sh
const xhr = new xhres6;

const xhrhandler = xhr.get('/Api/getArray', {return_xhr:true});
xhrhandler.onreadystatechange = (e) => {
	if(xhrhandler.readyState !== 4) return;
	let rptext = typeof(xhrhandler.responseText) === 'string' ? JSON.parse(xhrhandler.responseText) : xhrhandler.responseText;
	switch(xhrhandler.status){
		case 200:
			console.log(rptext);
			break;
		case 401:
			console.log(rptext);
			break;
		default:
			console.log('status error unknow status code');
	}
};
```
