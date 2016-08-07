// XMLHttpRequest with Promise and ES6 syntax
// Author by AquirJan, wing.free0@gmail.com
// create at 8-2-2016
// last modify at 8-7-2016

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
			timeout:60000,
			files:[]
		}
		
		this.version = '1.0.0';
		
		if(_options && typeof(_options) === 'object'){
			this.options = Object.assign({}, this.d_options, _options);
			return this.request();
		}else{
			return this;
		}
	}
	
	request(){

		if(this.options.data_type != 'raw' && this.options.data_type != 'form-data' && this.options.data_type!= 'json' ){
			console.warn('invalidate data_type value, I will use default (json) \n data_type = [form-data | json]');
			this.options.data_type = 'raw';
		}
		
		const { url, method, timeout, async, data, headers, return_xhr, form_data, files, data_type } = this.options;

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
					if(!window.FormData){
						return console.log('Error : no FormData support');
					}
					const formData = new FormData();
					formData.append('uploads', files);
					formData.append('datas', JSON.stringify(data));
					xhr.send(formData);
					break;
				case 'raw':
// 					console.log('raw');
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
				let rptext = typeof(xhr.responseText) === 'string' && xhr.responseText!=='' ? JSON.parse(xhr.responseText) : xhr.responseText;
				rptext = Object.assign({}, { body : rptext }, { xhr_status : xhr.status});
				return resolve(rptext);
// 				switch(xhr.status){
// 					case 200:
// 						return resolve(rptext);
// 						break;
// 					case 401:
// 						return resolve(rptext);
// 						break;
// 					default:
// 						throw new Error('status error unknow status code');
// 				}
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
	
	delete(_url = '', _options = {}){
		this.options = Object.assign({}, this.d_options, _options, {url:_url, method:'DELETE'});
		
		return this.request();
	}
	
}

export default xhres6;