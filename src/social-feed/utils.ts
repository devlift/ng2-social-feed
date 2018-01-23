export class Utils {
  public static timesince(date) {
    date = new Date(date);
    const seconds = Math.floor((+new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }
  private static isFunc(obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
  }
  private static isString(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
  }
  public static result(object, property) {
    if (object == null) {
      return;
    }
    const value = object[property];
    return Utils.isFunc(value) ? value.call(object) : value;
  }

  public static bind(fn, context) {
    const args = [].slice.call(arguments, 2);
    return function() {
      return fn.apply(context || this, args.concat([].slice.call(arguments)));
    };
  }

  public static has(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  public static extend(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      if (source) {
        for (const prop in source) {
          if (source.hasOwnProperty(prop)) {
            obj[prop] = source[prop];
          }
        }
      }
    });
    return obj;
  }

  public static template(template, o) {
    // From douglas crockfords
    return template.replace(/{([^{}]*)}/g, function(a, b) {
      const r = o[b];
      return typeof r === "string" || typeof r === "number" ? r : a;
    });
  }
}
