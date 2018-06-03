import ComponentPropConfig from '../types/ComponentPropConfig';

export default function validateProperty<T>(it: T, propName: string, propConfig: ComponentPropConfig<T>) {
    let
      ret = null,
      errMsg = null;
  
    const
      nullable = propConfig.nullable === true,
      typeConstructor = propConfig.type || null,
      constraint = propConfig.constraint || null,
      hasDefaultValue = propConfig.hasOwnProperty('defaultValue'),
      isDefaultValue = hasDefaultValue && it === propConfig.defaultValue;
  
    if (it === undefined
      && (!propConfig.hasOwnProperty('defaultValue')
      || propConfig.defaultValue !== undefined)) {
  
      errMsg = `Missing mandatory property '${propName}'`;
    } else if (it === null && nullable === true) {
      // Perfectly fine
    } else if (it === null && nullable === false) {
      errMsg = `Property '${propName}' must not be null`;
    } else if (typeConstructor !== undefined && typeConstructor !== null) {
      const type = typeof it;
      
      switch (typeConstructor as any) {
      case Boolean:
        if (type !== 'boolean') {
          errMsg = `Property '${propName}' must be boolean`;
        }
        
        break;
        
      case Number:
        if (type !== 'number') {
          errMsg = `Property '${propName}' must be a number`;
        }
        
        break;
      
      case String:
        if (type !== 'string') {
          errMsg = `Property '${propName}' must be a string`;
        }
        
        break;
        
      case Function:
        if (type !== 'function') {
          errMsg = `Property '${propName}' must be a function`;
        }
        
        break;
        
      default:
        if (typeConstructor && !(it instanceof typeConstructor)) {
          errMsg = `The property '${propName}' must be of typeConstructor '`
            + typeConstructor.name + "'";
        }
      }
    }
  
    if (!errMsg && !(nullable && it === null) && !isDefaultValue && constraint) {
      let err =
        typeof constraint === 'function' 
          ? constraint(it)
          : constraint.validate(it);
      
      if (err === false) {
        errMsg = `Illegal value for property '${propName}'`;
      } else if (typeof err === 'string') {
        errMsg = `Invalid value for property '${propName}' => ${err}`;
      } else if (err && typeof (err as any).message === 'string') {
        errMsg = `Invalid value for property '${propName}' => `
          + (err as any).message;
      } else if (err) {
        errMsg = String(err);
      }
    }
  
    if (errMsg) {
      ret = new Error(errMsg);
    } 
  
    return ret;
  }
