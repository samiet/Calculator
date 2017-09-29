var butArr = document.querySelectorAll(".value");
var actArr = document.querySelectorAll(".action");
var numberField = document.getElementById("number");
var deleteBut = document.getElementById("delete");
var backspace = document.getElementById("backspace");
var expr = document.getElementById("exp");
var r = document.getElementById("res");
var result = document.getElementById("result");
var wrong = document.getElementById("wrong");
var check=false;

numberField.oninput = function(e){
    validator();
}
numberField.onkeydown=function(e){
    if(check){
        wrong.innerHTML='';
        check=false;
    }
    if(e.which==13){
        wrongStr();
        if(!check){
            expr.innerHTML='EXP: '+numberField.value;
            numberField.value=rpn(numberField.value);
            r.innerHTML='RES: '+numberField.value;
        }
    }
}
deleteBut.onclick = function(){
    if(check){
        wrong.innerHTML='';
        check=false;
    }
    numberField.value='';
}
result.onclick = function(e){
    wrongStr();
    if(!check){
        expr.innerHTML='EXP: '+numberField.value;
        numberField.value=rpn(numberField.value);
        r.innerHTML='RES: '+numberField.value;
    }
}
backspace.onclick = backspaceFunc;
for(let i=0;i<butArr.length;i++){
    butArr[i].onclick = addValue;
}
for(i=0;i<actArr.length;i++){
    actArr[i].onclick = action;
}
//------------------------functions-----------------------------
function addValue(e){
    let str=numberField.value;
    if(check){
        wrong.innerHTML='';
        check=false;
    }
    if(str[str.length-1] && str[str.length-1]==')'){}
    else(numberField.value+=e.target.value);
}
function bracesNum(){
    let str=numberField.value;
    let brcOpen=str.match(/\(/g)?str.match(/\(/g).length:0;
    let brcClose=str.match(/\)/g)?str.match(/\)/g).length:0;
    return(brcOpen-brcClose);
}
function action(e){
    if(check){
        wrong.innerHTML='';
        check=false;
    }
    validator(e.target.value);
}
function validator(val){
    let s = val?val:numberField.value.split('').pop();
    let src = val?numberField.value:numberField.value.split('').slice(0,numberField.value.split('').length-1).join('');
    console.log(s);
    console.log(src);
    let brace = (val==')')?bracesNum()-1:bracesNum();
    if(src.length==0){
        if(/[-\(0-9]/.test(s)){
            src+=s;
        }
    }
    else if(src.length==1){
        if(/0/.test(src)){
            if(/[-+*\.\^]/.test(s)){src+=s;}
        }
        else if(/[0-9]/.test(src)){
            if(/[-+*/\.\^0-9]/.test(s)){src+=s;}
        }
        else if(/\-/.test(src)){
            if(/[0-9\(]/.test(s)){src+=s;}
        }
        else if(/\(/.test(src)){
            if(/[-\(0-9]/.test(s)){src+=s;}
        }
    }
    else if(src.length>1){
        if(brace>=0){
            if(/[-+*/\^\(]0\.$/.test(src)){
                if(/[0-9]/.test(s)){src+=s;}
            }
            else if(/[-+*/\^\(]0$/.test(src)){
                if(/[-+*\^\)\.]/.test(s)){src+=s;}
            }
            else if(/[0-9]+\.[0-9]+$/.test(src)){
                if(/[-+*/\^\)0-9]/.test(s)){src+=s;}
            }
            else if(/[0-9]+\.$/.test(src)){
                if(/[0-9]/.test(s)){src+=s;}
            }
            else if(/[0-9]+$/.test(src)){
                if(/[-+*/\^\.\)0-9]/.test(s)){src+=s;}
            }
            else if(/[-+*/\^]$/.test(src)){
                if(/[0-9\(]/.test(s)){src+=s;}
                else if(/[-+*/\^]/.test(s) && src[src.length-2]!='('){
                    src=src.split('').slice(0,src.length-1).join('');
                    src+=s;
                }
            }
            else if(/\)$/.test(src)){
                if(/[-+*/\^\)]/.test(s)){src+=s;}
            }else if(/\($/.test(src)){
                if(/[-0-9\(]/.test(s)){src+=s;}
            }
        }
        else{
            if(/[-+*/\^]0\.$/.test(src)){
                if(/[0-9]/.test(s)){src+=s;}
            }
            else if(/[-+*/\^]0$/.test(src)){
                if(/[-+*\^\.]/.test(s)){src+=s;}
            }
            else if(/[0-9]+\.[0-9]+$/.test(src)){
                if(/[-+*/\^0-9]/.test(s)){src+=s;}
            }
            else if(/[0-9]+\.$/.test(src)){
                if(/[0-9]/.test(s)){src+=s;}
            }
            else if(/[0-9]+$/.test(src)){
                if(/[-+*/\^\.0-9]/.test(s)){src+=s;}
            }
            else if(/[-+*/\^]$/.test(src)){
                if(/[0-9\(]/.test(s)){src+=s;}
                else if(/[-+*/\^]/.test(s) && src[src.length-2]!='('){
                    src=src.split('').slice(0,src.length-1).join('');
                    src+=s;
                }
            }
            else if(/\)$/.test(src)){
                if(/[-+*/\^]/.test(s)){src+=s;}
            }else if(/\($/.test(src)){
                if(/[-0-9\(]/.test(s)){src+=s;}
            }
        }
    }
    numberField.value=src;
}
function backspaceFunc(){
    if(check){
        wrong.innerHTML='';
        check=false;
    }
    if(numberField.value != ""){    
        numberField.value = numberField.value.slice(0, numberField.value.length-1);
    }
}
function wrongStr(){
    let str = numberField.value;
    if(/[-+*/\^\.]$/.test(str)){
        wrong.innerHTML='Лишний символ "'+str.split('').pop()+'" в конце!';
        check=true;
    }
    else if(bracesNum()){
        wrong.innerHTML='Незакрытая скобка!';
        check=true;
    }
}
//---------------------------PARSER----------------------------
//Creating array from string
function parser(exp){
    exp=exp.replace(/^(-[0-9\(])/g,'0$1');
    exp=exp.replace(/\((-\(\-?[0-9\(\-])/g,'(0$1');
    exp=exp.replace(/\((-[0-9]+)/g,'(0$1');
    exp=exp.replace(/([0-9\.]+)/g,'$1X');
    exp=exp.replace(/([\/\*\-\+\^()])/g,'$1X');
    exp=exp.replace(/0\.0+/g,'0');
    exp=exp.split('X');
    return(exp.slice(0,exp.length-1));
}
function checkSign(sign,arr){
    if(/[0-9\.]+/.test(sign)){
        return('4');
    }
    if(arr.length>0){
        switch(sign){
            case '(':
                return('1'); //push to oper
                break;
            case '+':
            case '-':
                    switch(arr[arr.length-1]){
                    case '(':
                        return('1'); //push to oper
                        break;
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case '^':
                        return('2');//pop from oper and push sign
                        break;
                    }
                break;
            case '*':
            case '/':
                switch(arr[arr.length-1]){
                    case '(':
                    case '+':
                    case '-':
                        return('1'); //push to oper
                        break;
                    case '*':
                    case '/':
                    case '^':
                        return('2');
                        break;
                }
                break;
            case '^':
                switch(arr[arr.length-1]){
                    case '(':
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                        return('1'); //push to oper
                        break;
                    case '^':
                        return('2');
                        break;
                }
                break;
            case ')':
                return('3');
                break;
            default:
                return('4');
                break;
        }
    }
    else return('1');
}
function codeTest(sign,arr){
    if(arr.length>0){var last = arr[arr.length-1];}
    else return(false);
    switch(sign){
        case '+':
        case '-':
            switch(last){
                case '+':
                case '-':
                case '*':
                case '/':
                case '^':
                    return(true);
                    break;
                default:
                    return(false);
                    break;
                }
            break;
        case '*':
        case '/':
            switch(last){
                case '*':
                case '/':
                case '^':
                    return(true);
                    break;
                default:
                    return(false);
                    break;
                }
            break;
        case '^':
            switch(last){
                case '^':
                    return(true);
                    break;
                default:
                    return(false);
                    break;
                }
            break;
        default:
            return(false);
            break;
    }
}
function rpn(exp){
    let expArr=parser(exp);
    let oper=[];
    let rpnString='';
    
    while(expArr.length>0){
        let firstSign=expArr.shift();
        switch(checkSign(firstSign,oper)){
            case '1':
                oper.push(firstSign);
                break;
            case '2':
                while(codeTest(firstSign,oper)){
                    rpnString = rpnString+'X'+oper.pop()+'X';
                }
                oper.push(firstSign);
                break;
            case '3':
                let i=oper.length-1;
                while(oper[i]!='('){
                    rpnString = rpnString+'X'+oper.pop()+'X';
                    i--;
                }
                oper.pop();
                break;
            case '4':
                rpnString = rpnString +'X'+ firstSign+'X';
                break;
        }
    }
    while(oper[0]){
        rpnString = rpnString +'X'+oper.pop()+'X';
    }
    rpnString=calculateRpn(rpnString);
    
    return(rpnString);
}
function calculateRpn(exp){
    let reg = /X\-?[0-9\.]+XX\-?[0-9\.]+XX[\/\*\-\+\^]X/g;
    let sol;
    while(reg.test(exp)){
        let newReg = exp.match(reg);
        for(let i=0;i<newReg.length;i++){
            let regArr=newReg[i].replace(/^X(.*)X$/,'$1').split('XX');
            let a,b;
            (regArr[0]-Math.floor(regArr[0]))?a=parseFloat(regArr[0]):a=parseInt(regArr[0]);
            (regArr[1]-Math.floor(regArr[1]))?b=parseFloat(regArr[1]):b=parseInt(regArr[1]);
            let secondReg = new RegExp('X'+a+'XX'+b+'XX'+'\\'+regArr[2]+'X','');
            switch(regArr[2]){
                case '-':
                    sol=a-b;
                    break;
                case '+':
                    sol=a+b;
                    break;
                case '/':
                    sol=a/b;
                    break;
                case '*':
                    sol=a*b;
                    break;
                case '^':
                    sol=Math.pow(a,b);
                    break;
            }
            exp=exp.replace(secondReg,'X'+sol+'X');
        }
    }
    return(exp.replace(/X(.*)X/,'$1'));
}