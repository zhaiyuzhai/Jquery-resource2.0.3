/**
 * 为什么要去传入window，1、查找速度就会变快2、方便压缩
 * 传入undefined可以防止在外部被修改
 */
(function (window,undefined) {
    // 21-94定义了一些变量和函数
    var rootjQuery,//方便压缩
        // dom的准备
        readyList,
        // 判断undefined
        core_strundefined=typeof undefined,
        location=window.location,
        document=window.document,
        // html的标签
        docEle=window.documentElement,
        // 用来防止冲突，防止之前出现类似的$符号
        _$=window.$,
        _jQuery=window.jQuery,
        // 来使用$.type的方法{'[object String]':string}
        class2type={},
        core_version='2.0.3',
        // 缓存data的id
        core_deletedIds=[],
        // 保存数组的方法
        core_concat=core_deletedIds.concat,
        core_push=core_deletedIds.push,
        core_slice=core_deletedIds.slice,
        core_indexOf=core_deletedIds.indexOf,

        core_toString=class2type.toString,
        core_hasOwn=class2type.hasOwnProperty,
        core_trim=core_version.trim,
        jQuery=function (selector,context) {
            return new jQuery.prototype.init(selector,context,rootjQuery);
        },
        // 匹配数字的正则
        core_pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        core_rnotwhite=/\s+/g,
        // 匹配标签<p>aaaaaa或者#div（匹配单标签无法匹配多个标签）
        requickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        // 此处\1表示要与前面的小括号里面的内容要匹配
        rsingleTag=/^<(\w+)\s*\/?>(?:<\/\1>|>)$/,
        // 匹配ms的前缀  MsMarginLeft
        rmsPrefix=/^-ms-/,
        // 转前缀为大写的正则 -2d=>2d
        rdashAlpha=/-([\da-z])/gi,
        // 转换驼峰的回调函数
        fcamelCase=function (all,letter) {
            return letter.toUpperCase();
        },
        // DOM加载成功后触发的回调函数
        completed=function () {
            document.removeEventListener("DOMContentLoaded",completed,false);
            window.removeEventListener("load",completed,false);
            jQuery.ready();
        };

    // 96-283给jq对象添加一些方法和属性
    jQuery.fn=jQuery.prototype={
        jquery:core_version,
        constructor:jQuery,
        // 对$("")进行处理,
    // 0:li
//     1:li
//     2:li
//     context:document
//     length:3
//     prevObject:[document, context: document]
//     selector:"li"
//     __proto__:Object(0)
        init:function (selector, context, rootjQuery) {
            // 首先申明两个变量匹配和元素
            var match, elem;
            // 如果为空或者undefined，null，false直接返回this
            if (!selector) {
                return this;
            }
            // 如果选择器是一个字符串的话(除去了$(this)，$(document),$(function(){})的可能性，后期if在作处理)
            if (typeof selector === 'string') {
                // 如果是纯的标签类的话例如<li></li>或者是<li></li><li></li>
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length > 2) {
                    match = [null, selector, null];//<li></li>或者是<li></li><li></li>
                } else {
                    // 如果不是纯标签累的话就去匹配，例如id或者<li>111
                    match = requickExpr.exec(selector);
                    //[ '<li>1', '<li>', index: 0, input: '<li>11' ]
                    // [ '#id', undefined, 'id', index: 0, input: '#id' ]
                }
                // 如果匹配到了并且是标签或者是没有上下文的话()
                if (match && (match[1] || !context)) {

                    // 对创建标签的处理，如果匹配到了标签的话<li></li>或者是<li></li><li></li>
                    if (match[1]) {
                        // 对上下文进行处理$("<li>",$("ul"))类似的情况
                        context = context instanceof jQuery ? context[0] : context;
                        // 对HTML标签进行处理，jQuery.merge追加进入this的对象，jQuery.parseHTML将一组HTML标签转化成为数组来进行处理[li,li]
                        jQuery.merge(this, jQuery.parseHTML(
                            match[1],
                            //指定当前的环境，context不为空的话才执行
                            context && context.nodeType ? context.ownerDocument || context : document,
                            //处理script的标签的
                            true
                        ));
                        // 匹配单标签并且后面加了属性的
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                // 判断属性是否在jquery当中有这样的方法，例如{title：“aa”，html：“this is a demo”}
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match]);
                                } else {
                                    this.attr(match, context[match])
                                }
                            }
                        }
                        return this;
                    }
                    else {


                        // 处理没有上下文的情况: [ '#id', undefined, 'id', index: 0, input: '#id' ]
                        elem = document.getElementById(match[2]);
                        // 对elem进行处理，因为在黑莓的系统中，即使elem被删除了还是能够被找到，所以就要判断他的父节点的存在性
                        if (elem && elem.parentNode) {
                            this.length = 1;
                            // this其实是一个对象，亦或可以写成this.0=elem
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                }
                // 处理复杂选择器的选项
                else if (!context || context.jquery) {
                    // 无上下文或者有上下文但是上下文是一个jquery的对象的时候的处理方法
                    // rootjQuery其实就是$(document)
                    return (context || rootjQuery).find(selector);
                } else {
                    // 有上下文但是上下文并不是jquery的对象
                    return this.constructor(context).find(selector);
                }
            }
            // HANDLE: $(DOMElement)
            else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }
            // HANDLE: $(function)
            else if (jQuery.isFunction(selector)) {
                // ready函数其实就是window.onDOMContentLoaded
                return rootjQuery.ready(selector);
            }
            // 处理一帮闲出个屁来的人的写法例如$($("#div"))
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            // 连同上面的处理，再加上传入数组或者json的写法，做出返回
            // 关于makeArray的用法，写入一个参数的时候转换成为一个数组，写入两个参数的话就转换成为一个对象的形式
            return jQuery.makeArray(selector, this);
        },
        selector:"",
        length:0,
        // 转原生数组
        toArray:function () {
            return core_slice.call(this);
        },
        // 获取原生的DOM集合
        get:function (num) {
            return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                ( num < 0 ? this[ this.length + num ] : this[ num ] );
        },
        // 压入栈的处理
        pushStack:function (elems) {
            // 将新的jquery对象压入一个对象中去
            var ret=jQuery.merge(this.constructor(),elems);
            // 设定这个新对象的前一个对象为原始的jquery对象
            // 例如：$("ul").pushStack(${"div"}})
            ret.prevObject=this;
            // 将新压入的对象的上下文设置成之前的文
            ret.context=this.context;
        },



        each:function (callback,args) {
            return jQuery.each(this,callback,args);
        },
        ready:function (fn) {
            // 参考源码的819行
            jQuery.ready.promise().done(fn);
        },
        slice:function () {
            return this.pushStack(core_slice.apply(this,arguments))
        },
        first:function () {
            return this.eq(0)
        },
        last:function () {
            return this.eq(-1);
        },
        eq:function (i) {
            var len=this.length,
            j=+i+(i<0?len:0);
            return this.pushStack(j>=0&&j<len?[this[j]]:[]);
        },
        map: function( callback ) {
            return this.pushStack( jQuery.map(this, function( elem, i ) {
                return callback.call( elem, i, elem );
            }));
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },


        push: core_push,
        sort: [].sort,
        splice: [].splice
        
    };
    jQuery.prototype.init.prototype=jQuery.prototype;
    // 285-347 extend继承的方法
    jQuery.extend=jQuery.fn.extend=function () {
        var options,name,src,copy,copyIsArray,clone,
            // target运用的很好，细读
            target=arguments[0]||{},
            i=1,
            length=arguments.length,
            deep=false;
        if(typeof target==="boolean" ){
            deep=target;
            target=arguments[1]||{};
            i=2;
        }
        if(typeof target!=="object"&&jQuery.isFunction(target)){
            target={};
        }
        // 只有一个参数的时候将其扩展到$上面去
        if(length===i){
            target=this;
            --i;
        }
        for(;i<length;i++){
            if((options=arguments[i])!=null){
                for(name in options){
                    src=target[name];
                    copy=options[name];
                    // 防止出现类似$.extend(a,{name:a})
                    if(target===copy){
                        continue;
                    }
                    // 如果是深拷贝的话并且copy有值得时候并且copy是一个对象或者数组的话
                    if(deep&&copy&&(jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )){
                        // 1、如果copy是一个数组的话
                        if(copyIsArray){
                            copyIsArray = false;
                            clone=src&&jQuery.isArray(src)?src:[];
                        }else{
                            //防止出现类似$.extend({name:{age:10}},{name:{sex:1}})
                            clone=src&&jQuery.isPlainObject(src)?src:{};
                        }
                        target[ name ] = jQuery.extend( deep, clone, copy );
                    }else if(copy!==undefined){
                        target[name]=copy;
                    }
                }
            }
        }
        return target;
    }
    // 349-817扩展一些工具方法
    // 供给jquery内部使用的
    jQuery.extend({
        expando:"jQuery"+(core_version+Math.random()).replace(/\d/g,""),
        // 防止冲突的方法
        noConflict:function (deep) {
            if(window.$===jQuery){
                window.$=_$;
            }
            if(deep&&window.jQuery===jQuery){
                window.jQuery=_jQuery;
            }
            return jQuery;
        },
        isReady:false,
        readyWait:1,
        // 用来延迟DOM的操作（里面的内容填写true或者是false）
        holdReady:function (hold) {
            // 假如调用了holdReady的话，将状态加一
            if(hold){
                jQuery.readyWait++;
            }else{
                // 否则执行ready的方法
                jQuery.ready(true);
            }
        },
        // 此ready的函数的调用的话主要由两个部分组成，一个是供给开发人员来调用，一方面是给jquery的内部调用，所以内部给了传参的方法
        ready:function (wait) {
            // wait用来判断是内部还是外部使用
            if(wait===true?--jQuery.readyWait:jQuery.isReady){
                // 如果此函数的调用是由holdReady来的话就要判断readyWait的状态
                return ;
            }
            // Remember that the DOM is ready
            jQuery.isReady = true;
            // 假如不为true的话就表示是由外部调用进入的，那么就需要判断之前是否有等待
            if(wait!==true&&--jQuery.readyWait>0){
                return ;
            }
            // 带解决的函数，以后查看？？？？
            readyList.resolveWith( document, [ jQuery ] );

            if(jQuery.fn.trigger){
                jQuery(document).trigger("ready").off("ready");
            }
        },
        isFunction:function (obj) {
            return jQuery.type(obj)==="function";
        },
        isArray: Array.isArray,
        isWindow:function (obj) {
            // obj!=null防止输入null，undefined，“”等等没有属性的东西，从而产生报错
            return obj!=null&&obj===obj.window;
        },
        isNumeric:function (obj) {
            // typeof NaN也是number类型
            return !isNaN(parseFloat(obj))&&isFinite(obj);
        },
        type:function (obj) {
            // null的typeof出来的类型是object（undefined和null）
            if(obj===null){
                return String(obj);
            }
            // 完美的利用了对象的toString的方法（返回对象的字符串）
            return typeof obj==="object"||typeof
                obj==="function"?class2type[core_toString.call(obj)]||"object":typeof  obj;
        },
        isPlainObject:function (obj) {
            // 不是对象自变量的但是也会被typeof成object的有
            // 1.window；2.DOM nodes 3.Any object or value whose internal [[Class]] property is not "[object Object]"
            if(jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){
                return false;
            }
            // 来查看window底下的对象，location，history。。。
            // 之所以要try，catch的话是因为在火狐小于20的版本调用location频繁的话会有报错
            try{
                // obj的constructor是Object，并且它的原型里面特有的属性isPrototypeOf
                if ( obj.constructor &&
                    !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                    return false;
                }
            }catch(e){
                return false;
            }
            return true;
        },
        isEmptyObject:function (obj) {
            // 如果能够通过for in循环遍历出来的对象则直接退出
            for (var name in obj ) {
                return false;
            }
            return true;
        },
        error: function( msg ) {
            throw new Error( msg );
        },
        parseHTML:function (data,context,keepScripts) {
            // 首先对data来进行判断，如果没有的话或者不是string的直接退出
            if( !data || typeof data !== "string"){
                return null;
            }
            // 倘若第二个参数不写，而是直接写入第三个参数的话，做的错误处理
            if ( typeof context === "boolean" ) {
                keepScripts = context;
                context = false;
            }
            context=context||document;
        }

    })
    // 877-2856 选择器的功能
    // 2880-3042 jQuery里面的回调对象
    // 3043-3183延迟对象（异步）
    // 3184-3295实现support：功能检测
    // 3308-3625数据缓存
    // 3653-3797队列管理
    // 3803-4299attr，prop。。。。
    // 4300-5128on，triggle事件
    // 5140-6057 DOM的操作和包装
    // 6058-6620样式的操作
    // 6621-7854 提交数据和ajax的功能
    // 7855-8584运动的操作
    // 8585-8792 位置与尺寸的方法
    // 8804-8821模块化的写法
    // 8826将jquery挂载到了window底下
    window.jQuery=window.$=jQuery;
})(window,undefined)