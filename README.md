# resangel

XMLHttpRequest ES6 Promise

options

```sh
	method:"POST || GET || HEAD || DELETE || PUT", default 'POST'
	headers:{
		'XX':'XX'
	},
	data:{
		'XX':'XX'
	},
	sendDataType:'raw || form-data || json', defualt 'json',
	resDataType:"json", 
	async:true || false, defualt true
	url:'',
	timeout:10000
```
** option [resDataType] now just for 'json' **

simple demo

```sh
const xhr = new xhres6;

// xhr.xhr can get XMLHttpRequest handler

xhr.get('/Api/getArray').then(function(_rpdata){
	console.log(_rpdata);
	const { headers, body, xhr_status, xhr} = _rpdata;
	// body this is server response data;
});

```

compress image canvas method

```sh
<input type="file" id="files" onchange="picOnchange(this)"/>
function picOnchange(e){
// 				console.dir(e.files);
	try{
		var _thise = e;
		var files = e.files;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var srcimg = new Image();
		var quality = 0.5;
		var tmp_srcimgdata = URL.createObjectURL(files[0]);
		srcimg.src = tmp_srcimgdata;
		srcimg.onload = function(){
			var destimg = new Image();
			canvas.width = srcimg.width;
			canvas.height = srcimg.height;
			ctx.drawImage(srcimg, 0, 0, srcimg.width, srcimg.height, 0, 0, srcimg.width, srcimg.height);
			var dataUrl = canvas.toDataURL(files[0].type, quality);
// 					console.log(dataUrl);
			destimg.src = dataUrl;
			destimg.title = 'preview image';
			document.body.appendChild(destimg);
			_thise.value = '';
		}
	}catch(e){
		alert("your browser doesn't support canvas");
	}
	
	
}

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
	sendDataType:'form-data',
	data:fd
}).then(function(_rpdata){
	console.log(_rpdata);
	const { headers, body, xhr_status, xhr} = _rpdata;
	// body this is server response data;
});

```
