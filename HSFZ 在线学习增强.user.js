// ==UserScript==
// @name         HSFZ 在线学习增强
// @namespace    http://tampermonkey.net/
// @version      0.2.1-alpha-release2
// @license      MIT
// @description  enhance the learning experience when using the HSFZ online learning system
// @description:zh 增强HSFZ在线学习平台体验
// @author       Rusmere
// @match        *://xuexi.hsfz.net.cn/autonomous-learning.html
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@latest/dist/sweetalert2.min.js
// @icon         http://www.hsfz.net.cn/homepage/images/bottomsn.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';
    var window = unsafeWindow;
    var document = window.document;
    window.$=$;
    window.Swal=Swal;
    window.cut = () => {
        var fileName = $('.course-name-box>span').text();
        var fileType = "png";
        var video = document.querySelector('video');
        var canvas = window.canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var strDataURL = canvas.toDataURL("image/" + fileType);
        var arr = strDataURL.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr], {
            type: mime
        });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 1000);
    }
    window.academic=()=>{
        var video=$('video')[0];
        $('.header').remove();
        $('.bottom-container').remove();
        $('.back-tip-box').remove();
        $('.ava-footer-wrapper').remove();
    }
    window.editcss=()=>{
        var usercss=GM_getValue('usercss',css);
        Swal.fire({
            title: '输入CSS代码',
            input: 'textarea',
            inputValue: usercss,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '完成',
            denyButtonText: '清除样式',
            cancelButtonText: '取消'
        }).then(function(result) {
            if (result.isConfirmed) {
                GM_setValue('usercss',result.value);
            }else if(result.isDenyed){
                GM_deleteValue('usercss');
            }
        })
    }
    var addspeeditem=(speed)=>{
        if(speed<0.5){
            $('.dplayer-setting-speed-panel').prepend(`<div class="dplayer-setting-speed-item" data-speed="${speed}"><span class="dplayer-label">${speed}</span></div>`);
        }else if(speed>2){
            $('.dplayer-setting-speed-panel').append(`<div class="dplayer-setting-speed-item" data-speed="${speed}"><span class="dplayer-label">${speed}</span></div>`);
        }
    };
    var css = [
        "::-webkit-scrollbar{",
        "   width: 6px;",
        "   height: 10px;",
        "   background-color: rgba(0, 0, 0, 0);",
        "}",
        "::-webkit-scrollbar-track{",
        "   background-color: rgba(0, 0, 0, 0.05);",
        "}",
        "::-webkit-scrollbar-thumb{",
        "   background-color: rgba(0, 0, 0, 0.2);",
        "   border-radius: 25px;",
        "}",
        "::-webkit-scrollbar-thumb:hover{",
        "   background-color: #000000;",
        "}"].join('\n');
    GM_addStyle(GM_getValue('usercss',''));
    document.onvisibilitychange = () => {
        var video = $('video')[0];
        if (document.visibilityState === 'hidden' && video.paused === false) {
            setTimeout(() => {
                video.play();
            }, 10);
        }
    }
    var Id=setInterval(()=>{
        if($('.icon-box-list').length>0&&$('video').length>0){
            clearInterval(Id);
            $('.icon-box-list').append('<span data-v-384ba0a4="" class="mr-10 icon-box" id="cut" onclick="cut()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#b8c6d8" class="bi bi-scissors" viewBox="0 0 16 16"><path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/></svg><span data-v-384ba0a4="" class="">截图</span></span>');
            $('.icon-box-list').append('<span data-v-384ba0a4="" class="mr-10 icon-box" id="academic" onclick="academic()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#b8c6d8" class="bi bi-easel" viewBox="0 0 16 16"><path d="M8 0a.5.5 0 0 1 .473.337L9.046 2H14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1.85l1.323 3.837a.5.5 0 1 1-.946.326L11.092 11H8.5v3a.5.5 0 0 1-1 0v-3H4.908l-1.435 4.163a.5.5 0 1 1-.946-.326L3.85 11H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.954L7.527.337A.5.5 0 0 1 8 0zM2 3v7h12V3H2z"/></svg><span data-v-384ba0a4="" class="">学术模式</span></span>');
            $('.icon-box-list').append('<span data-v-384ba0a4="" class="mr-10 icon-box" id="academic" onclick="editcss()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#b8c6d8" class="bi bi-braces-asterisk" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6ZM14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6ZM7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5h-1Z"/></svg><span data-v-384ba0a4="" class="">自定义CSS</span></span>');
            var video=$('video')[0];
            var config = { attributes: true };
            var src=video.src;
            var speeds=[0.375,0.2,0.1,5,10,14,16];
            for(let i of speeds){
                addspeeditem(i);
            }
            $('.dplayer-setting-speed-panel').on('click','.dplayer-setting-speed-item',function (){
                var r=$(this).attr('data-speed');
                $('.dplayer-speed').html(`${r} x`);
                $('video')[0].playbackRate=r;
            });
            var callback = function(mutationsList) {
                mutationsList.forEach(function(item,index){
                    if (item.type == 'attributes') {
                        if(item.attributeName=='src'){
                            var timeout=setInterval(()=>{
                                if($('.dplayer-setting-speed-panel').length>0){
                                    clearInterval(timeout);
                                    for(let i of speeds){
                                        addspeeditem(i);
                                    }
                                }
                            },100);
                        }
                    }
                });
            };
            var observer = new MutationObserver(callback);
            observer.observe(video, config);
        }
    },100);
})();
