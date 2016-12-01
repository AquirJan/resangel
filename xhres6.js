// XMLHttpRequest with Promise and ES6 syntax
// Author by AquirJan, wing.free0@gmail.com
// create at 8-2-2016
// last modify at 12-1-2016
// version 1.0.5;

class xhres6 {

	constructor(_options){
	
		this.d_options = {
			method:"POST",
			headers:{},
			data:{},
			data_type:'raw',
			async:true,
			url:'/',
			return_xhr:false,
			timeout:10000,
// 			files:[],
			outside_data:{}
		}
		
		this.version = '1.0.5';

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
		console.log(queryString);
		return queryString.length > 0 ? `?${queryString.join('&')}` : '';
	}
	
	request(){

		if(this.options.data_type != 'raw' && this.options.data_type != 'form-data' && this.options.data_type!= 'json' ){
			console.warn('invalidate data_type value, I will use default (json) \n data_type = [form-data | json]');
			this.options.data_type = 'raw';
		}
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
		
		const { url, method, timeout, async, data, headers, return_xhr, form_data, data_type } = this.options;

		const xhr = new XMLHttpRequest();
		xhr.open(method, url, async);
		if(data_type == 'json' || data_type == 'raw' ){
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
			switch(data_type){
				case 'form-data':
					xhr.send(data);
					break;
				case 'raw':
					xhr.send(JSON.stringify(data));
					break;
				case 'json':
					xhr.send(JSON.stringify(data));
					break;
				default:
					xhr.send(data);
			}
		}
		
		
		
		if(return_xhr){
			return xhr;
		}
		
		const xhrPromise = new Promise( (resolve, reject) => {
			xhr.onreadystatechange = () => {
				if(xhr.readyState !== 4) return;
				if(xhr.status==0){
					return reject({xhr_status:xhr.status, info:"timeout", xhr:xhr});
				}
				let rptext = typeof(xhr.responseText) === 'string' && xhr.responseText!=='' ? JSON.parse(xhr.responseText) : xhr.responseText;
				const header_array = xhr.getAllResponseHeaders().toLowerCase().replace(/\n/g,'||').replace(/\|\|$/,'').split('||');
				let headers_obj = {};
				for(let i=0;i<header_array.length;i++){
					const obj_item = header_array[i].split(": ");
					headers_obj[obj_item[0]] = obj_item[1];
				}
				
				rptext = Object.assign({}, { headers: headers_obj, body : rptext, xhr_status : xhr.status, xhr:xhr, outside_data:this.options.outside_data});
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