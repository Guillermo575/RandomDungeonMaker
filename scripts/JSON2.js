var JSON2 = (
	function(JSON, RegExp) {
	var specialChar = '~';
	var safeSpecialChar = '\\x' + ( '0' + specialChar.charCodeAt(0).toString(16) ).slice(-2);
	var escapedSafeSpecialChar = '\\' + safeSpecialChar;
	var specialCharRG = new RegExp(safeSpecialChar, 'g');
	var safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g');
	var safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar);
	var indexOf = [].indexOf || function(v) {
									for(var i=this.length;i--&&this[i]!==v;);
									return i;
								};
	var $String = String;

	function generateReplacer(value, replacer, resolve) {
	  var inspect = !!replacer;
	  var path = [];
	  var all  = [value];
	  var seen = [value];
	  var mapp = [resolve ? specialChar : '[Circular]'];
	  var last = value;
	  var lvl  = 1; var i; var fn;
	  
	  if (inspect) {
		fn = typeof replacer === 'object' ? function (key, value) {
												return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
											} : replacer;
	  }
	  return function(key, value) {
		if (inspect) 
			value = fn.call(this, key, value);
		if (key !== '') {
			if (last !== this) {
				i = lvl - indexOf.call(all, this) - 1;
				lvl -= i;
				all.splice(lvl, all.length);
				path.splice(lvl - 1, path.length);
				last = this;
			}
			if (typeof value === 'object' && value) {
				if (indexOf.call(all, value) < 0) 
					all.push(last = value);
				lvl = all.length;
				i = indexOf.call(seen, value);
				if (i < 0) {
					i = seen.push(value) - 1;
					if (resolve) {
						path.push(('' + key).replace(specialCharRG, safeSpecialChar));
						mapp[i] = specialChar + path.join(specialChar);
					} 
					else mapp[i] = mapp[0];
				} 
				else value = mapp[i];
			} 
			else {
				if (typeof value === 'string' && resolve) 
					value = value.replace(safeSpecialChar, escapedSafeSpecialChar).replace(specialChar, safeSpecialChar);
			}
		}
		return value;
	  };
	}

	function retrieveFromPath(current, keys) {
		for(var i = 0, length = keys.length; i < length; current = current[ keys[i++].replace(safeSpecialCharRG, specialChar) ]);
		return current;
	}

	function generateReparser(reparser) {
		return function(key, value) {
			var isString = typeof value === 'string';
			if (isString && value.charAt(0) === specialChar) 
				return new $String(value.slice(1));
			if (key === '') 
				value = regenerate(value, value, {});
			if (isString) 
				value = value.replace(safeStartWithSpecialCharRG, '$1' + specialChar).replace(escapedSafeSpecialChar, safeSpecialChar);
			return reparser ? reparser.call(this, key, value) : value;
		};
	}

	function regenerateArray(root, current, retrieve) {
		for (var i = 0, length = current.length; i < length; i++)
			current[i] = regenerate(root, current[i], retrieve);
		return current;
	}

	function regenerateObject(root, current, retrieve) {
		for (var key in current)
			if (current.hasOwnProperty(key)) 
				current[key] = regenerate(root, current[key], retrieve);
		return current;
	}

	function regenerate(root, current, retrieve) {
		return current instanceof Array ?
				regenerateArray(root, current, retrieve) :
				( current instanceof $String ? 
					  (current.length ? ( retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath( root, current.split(specialChar) ) ) : root) : 
					  (current instanceof Object ? regenerateObject(root, current, retrieve) : current)
				);
	}

	function stringifyRecursion(value, replacer, space, doNotResolve) { return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space); }

	function parseRecursion(text, reparser) { return JSON.parse(text, generateReparser(reparser)); }

	return { stringify: stringifyRecursion, parse: parseRecursion };

}(JSON, RegExp));