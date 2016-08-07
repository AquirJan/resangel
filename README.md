# xhres6
XMLHttpRequest ES6 Promise

simple demo
```sh
const xhr = new xhres6;

xhr.get('/Api/getArray').then(function(e){
	console.log(e);
});
```

when synchronous must set return_xhr: true demo

```sh
const xhr = new xhres6;
const xhrh = xhr.get('/Api/getArray', 
	{
		async:false,
		return_xhr: true,
		data : { param0 : "test" } 
	} 
);
if(xhrh.status == 200){
	console.log(xhrh.responseText);
}
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
