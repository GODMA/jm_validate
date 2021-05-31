//对象里目前能解析的字段格式：required, string,number,boolean,object（整个对象复制）, rule格式（包含数组、对象解析）
export function validatorObj(name: string, data: any, rule: any, canExceed: boolean = true) {
    let result = {} as any;
    let nPath = new Array<string>(name);
    validateData(result, data, rule, canExceed, nPath);
    return result;
}

function validateData(result: any, data: any, rule: any, canExceed: boolean, nPath: Array<string>) {
    if (canExceed) {
        Object.assign(result, data);
    }
    for (let key in rule) {
        let conditions = rule[key].split('|');
        for (let condition of conditions) {
            nPath.push(key);
            validate(condition, key, result, data[key], canExceed, nPath);
            nPath.pop();
        }
    }
}

function validate(condition: string, key: string, result: any, value: any, canExceed: boolean, nPath: Array<string>) {
    if (!value) {
        if (condition == "required") {
            throw Error(`param [${nPath.join('.')}] required`)
        }
        return;
    };
    switch (condition) {
        case "required":
            break;
        case "number":
        case "string":
        case "boolean":
        case "object":
            if (typeof value != condition) {
                throw Error(`param [${nPath.join('.')}] type wrong`);
            }
            if (result) {
                if (result.constructor == Object) {
                    result[key] = value;
                }
                if (result.constructor == Array) {
                    result.push(value);
                }
                break;
            }
            result = value;
            break;
        default:
            let subRule;
            if (condition.slice(-2) == '[]') {
                subRule = condition.slice(0, -2);
                if (value.constructor != Array) {
                    throw Error(`param [${nPath.join('.')}] type wrong`);
                }
                if (result.constructor == Object) {
                    result[key] = [] as any[];
                    if (canExceed) {
                        Object.assign(result[key], value);
                    }
                } else {
                    result = [] as any[];
                    if (canExceed) {
                        Object.assign(result, value);
                    }
                }

                for (let item of value) {
                    if (result.constructor == Object) {
                        validate(subRule, key, result[key], item, canExceed, nPath);
                    } else {
                        nPath.push(key);
                        validate(subRule, key, result, item, canExceed, nPath);
                        nPath.pop();
                    }
                }
                break;
            }
            try{
                subRule = JSON.parse(condition);
            }catch(e){
                throw Error(`param [${nPath.join('.')}] ruleconfig wrong`);
            }
            if (subRule.constructor == Object) {
                if (value.constructor != Object) {
                    throw Error(`param [${nPath.join('.')}] type wrong`);
                }
                if (result.constructor == Object) {
                    result[key] = {} as any;
                    validateData(result[key], value, subRule, canExceed, nPath);
                } else {
                    nPath.push(key);
                    let item = {} as any;
                    validateData(item, value, subRule, canExceed, nPath);
                    result.push(item);
                    nPath.pop();
                }
            }
            break;
    }

}