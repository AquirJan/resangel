// XMLHttpRequest with Promise and ES6 syntax
// Author by AquirJan, wing.free0@gmail.com
// create at 8-2-2016
// last modify at 3-30-2017
// version 1.0.7;
// commit : fix sendDataType default type;

class xhres6 {

	constructor(_options){
	
		this.d_options = {
			method:"POST",
			headers:{},
			data:{},
			sendDataType:'raw', //xhr send data type
			async:true,
			url:'/',
			resDataType:'', //response data type
// 			return_xhr:false,
			timeout:10000,
			
// 			files:[],
			outside_data:{}
		}
		
		this.version = '1.0.7';
		
		this.xhr=new XMLHttpRequest();
		
		if(_options && typeof(_options) === 'object'){
			this.options = Object.assign({}, this.d_options, _options);
			return this.request();
		}else{
			return this;
		}
	}
	
	buildParamsAsQueryString(params){
		const queryString = [];
		
		for (const p in params) {
			if (params.hasOwnProperty(p)) {
				if(Array.isArray(params[p])){
					params[p].forEach((value, key)=>{
						queryString.push(`${p}=${value}`);
					})
				}else{
					queryString.push(`${p}=${params[p]}`);
				}
			}
		}
		return queryString.length > 0 ? `?${queryString.join('&')}` : '';
	}
	
	request(){

// 		if(this.options.sendDataType != 'raw' && this.options.sendDataType != 'form-data' && this.options.sendDataType!= 'json' ){
// 			console.warn('invalidate sendDataType value, I will use default (json) \n sendDataType = [form-data | json]');
// 			this.options.sendDataType = 'raw';
// 		}
		if(this.options.method == 'GET'){
			const reg = /(\[)(.*)(\])/;
			for(const key in this.options.data){
				if(this.options.data.hasOwnProperty(key) && reg.test(key)){
					let tmp_key = key;
					tmp_key = tmp_key.replace(reg, function(){
						if(arguments[1] == '['){
							arguments[1] = encodeURI('[');
						}
						if(arguments[3] == ']'){
							arguments[3] = encodeURI(']');
						}
						return arguments[1]+arguments[2]+arguments[3];
					})
					this.options.data[tmp_key] = this.options.data[key];
					delete this.options.data[key];
				}
			}
			
			this.options.url += this.buildParamsAsQueryString(this.options.data);
		}
		
		const { url, method, timeout, async, data, headers, form_data, sendDataType } = this.options;
			
		const xhr = this.xhr;
		
		xhr.open(method, url, async);
		if(sendDataType == 'json' ){
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		}
		
		for (const key in headers) {
			if (headers.hasOwnProperty(key)) {
				xhr.setRequestHeader(key, headers[key]);
			}
		}
		if(async){
			xhr.timeout = timeout;
		}
		
		
		
		if(method == 'GET' || method == 'HEAD'){
			xhr.send();
		}else{
			switch(sendDataType){
				case 'form-data':
					xhr.send(data);
					break;
				case 'raw':
					xhr.send(data);
					break;
				case 'json':
					xhr.send(JSON.stringify(data));
					break;
				default:
					xhr.send(data);
			}
		}
		
		const xhrPromise = new Promise( (resolve, reject) => {
			xhr.onreadystatechange = () => {
				if(xhr.readyState !== 4) return;
				if(xhr.status==0){
					return reject({xhr_status:xhr.status, info:"timeout"});
				}
				let rptext = typeof(xhr.responseText) === 'string' && xhr.responseText!=='' ? JSON.parse(xhr.responseText) : xhr.responseText;
				const header_array = xhr.getAllResponseHeaders().toLowerCase().replace(/\n/g,'||').replace(/\|\|$/,'').split('||');
				let headers_obj = {};
				for(let i=0;i<header_array.length;i++){
					const obj_item = header_array[i].split(": ");
					headers_obj[obj_item[0]] = obj_item[1];
				}
				
				rptext = Object.assign({}, { headers: headers_obj, body : rptext, xhr_status : xhr.status, outside_data:this.options.outside_data});
				return resolve(rptext);
			}
		})
		
		return xhrPromise;
	}
	
	get(_url = '', _options = {}){
		this.options = Object.assign({}, this.d_options, _options, {url:_url, method:'GET'});
		
		return this.request();
	}
	
	post(_url = '', _options = {}){
		this.options = Object.assign({}, this.d_options, _options, {url:_url, method:'POST'});
		
		return this.request();
	}
	
	put(_url = '', _options = {}){
		this.options = Object.assign({}, this.d_options, _options, {url:_url, method:'PUT'});
		
		return this.request();
	}
	
	delete(_url = '', _options = {}){
		this.options = Object.assign({}, this.d_options, _options, {url:_url, method:'DELETE'});
		
		return this.request();
	}
	
}

export default xhres6;