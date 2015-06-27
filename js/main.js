
if(typeof plugSimple !== "undefined"){plugSimple.init.stop(1);}
plugSimple = {
	AUTHOR: "R0CK",
	VERSION: "0_0 oh no",
	PREFIX: "[PlugSimple]",
	colors: {
		ERROR: "bb0000",
		WARN: "ddbb00",
		SUCCESS: "4bbd00",
		INFO: "009cdd",
		DEFAULT: "ac76ff",
		status: [
			"89be6c",//Avail
			"ffdd6f",//Away
			"f04f30",//Working
			"ac76ff" //Gaming
		]
	},
	img: {
		LOGO: "https://avatars.githubusercontent.com/u/12117443?v=3",
		AUTOWOOT_ON: "https://raw.githubusercontent.com/itotallyrock/PlugSimple/master/img/autowoot-on.png",
		AUTOWOOT_OFF: "https://raw.githubusercontent.com/itotallyrock/PlugSimple/master/img/autowoot-dis.png"
	},
	checkTimeout: "",
	tickRate: 1,//Ticks per second
	tickNum: 0,
	tick: "",
	rawVersion: "",
	commands: {},
	settings: {
		autowoot: true,
		autodj: false,
		verbose: 0//0-5 No Logging to All Loggings
		/*
			5 = Ticklog and chatlog
			4 = Status Logging
			3 = Less spammy status logging
			2 = 
			1 = Major Errors and messages
			0 = None
		*/
	},
	logging: {
		log: function(msg,verbose){
			if(verbose <= plugSimple.settings.verbose){
				console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700",msg);
			}
		},
		warn: function(msg,verbose){
			if(verbose <= plugSimple.settings.verbose){
				console.warn("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.WARN+"; font-weight:700;",msg);
			}
		},
		error: function(msg,verbose){
			if(verbose <= plugSimple.settings.verbose){
				console.error("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.ERROR+"; font-weight:700",msg);
			}
		},
		info: function(msg,verbose){
			if(verbose <= plugSimple.settings.verbose){
				console.info("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.INFO+"; font-weight:700",msg);
			}
		},
		success: function(msg,verbose){
			if(verbose <= plugSimple.settings.verbose){
				console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.SUCCESS+"; font-weight:700",msg);
			}
		}
	},
	util: {
		formatTime: function(t){
			var h = Math.floor(t / 3600),
			    m = Math.floor((t - (h * 3600)) / 60),
				s = t - (h * 3600) - (m * 60);
			
			return (h < 10 ? "0"+h : h)+':'+(m < 10 ? "0"+m : m)+':'+(s < 10 ? "0"+s : s);
		}
	},
	core: {
		getRawVersion: function(){
			var total = 45;//45 from commits before transferring to the organization
			$.getJSON("https://api.github.com/repos/plugSimple/plugSimple/stats/commit_activity").then(function(e){
				for(var i in e){
					total += e[i].total;
					plugSimple.rawVersion = total;
				}
			});
		},
		formatVersion: function(version){
			version = Math.abs(version);
			var r = "0.0";
			if(version < 100){
				r += version/10;
			}else if(version >= 100 && version < 1000){
				r = "0."+version.toString().substring(0,2)+"."+version.toString().substring(2,3);
			}else if(version >= 1000){
				r = version.toString().substring(0,1)+"."+version.toString().substring(1,3)+"."+version.toString().substring(3,4);
			}
			return r;
		},
	    saveVersion: function(){
		    localStorage.setItem("plugSimpleVersion",plugSimple.VERSION);//May do more elegant in future
			plugSimple.logging.info("Version has been saved",4);
		},
		saveSettings: function(){
			localStorage.setItem("plugSimple",JSON.stringify(plugSimple.settings));
			plugSimple.logging.info("Settings have been saved.",3);
		},
		getSettings: function(){
			plugSimple.settings = JSON.parse(localStorage.getItem("plugSimple"));
			plugSimple.logging.info("Retrieved Settings",3);
		},
		clearSettings: function(){
			localStorage.removeItem("plugSimple");
			plugSimple.logging.info("Cleared Settings",1);
			plugSimple.core.getSettings();
		},
		getTick: function(){
			return plugSimple.tickNum;
		},
		getETA: function(){
			if(API.getDJ() !== null && API.getDJ().id === API.getUser().id){
				return "00:00:00";
			}
			var history = API.getHistory(),histlength = 0, avg = 0;
			for(var i in history){
				histlength += history[i].media.duration;
			}
			avg = histlength/history.length;
			
			var sn = parseInt((API.getWaitListPosition() == -1 ? API.getWaitList().length : API.getWaitListPosition())*avg+API.getTimeRemaining(), 10);
			return sn;
		},
		autoWoot: function(){
			$("#woot").click();
			API.on(API.ADVANCE,function(){
				$("#woot").click();
				plugSimple.logging.info("Running AutoWoot",4);
			});
		},
		autoDJ: function(){
			if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){$("#dj-button").click();}
			API.on(API.ADVANCE,function(){
				if(API.getWaitListPosition() === -1 && API.getDJ().id !== API.getUser().id){
					$("#dj-button").click();
					plugSimple.logging.info("Running AutoDJ",4);
				}
			});
		},
		chatStatus: function(){
			//$("#chat").css("border-left","1px solid #1C1F25;");
			/*var i;
			for(i in $(".cm")){
				if(!$($(".cm")[i]).hasClass("ps-chatMsg")){
					$($(".cm")[i]).css("border-left","3px solid rgba(0,0,0,0);");
					$($(".cm")[i]).addClass("ps-chatMsg");
				}
			}*/
			$(".message").remove();
			API.on(API.CHAT, function(e){
				/*if(plugSimple.settings.debug && plugSimple.settings.chatLog){
					console.log("%c"+plugSimple.PREFIX,"color: #"+plugSimple.colors.DEFAULT+"; font-weight:700","ChatEvent",[e]);
				*/
				plugSimple.logging.log("ChatEvent ["+e+"]",5);
				var color = plugSimple.colors.status[API.getUser(e.uid).status];
				if(e.uid == API.getUser().id){
					color = "#ffdd6f";
				}else if(API.getUser(e.uid).friends){
					color = "#00b5e6";
				}else if(API.getUser(e.uid).role > 0){
					color = "#"+plugSimple.colors.DEFAULT;
				}else if($(".cm[data-cid=\""+e.cid+"\"] > .badge-box > i").hasClass("bdg-ba")){
					color = "#90ad2f";
				}else{
					//color = "777f92";
					color = "rgba(0,0,0,0)";
				}
				plugSimple.logging.info("chat msg color = #"+color, 5);
				$(".cm[data-cid=\""+e.cid+"\"]").css("border-left","3px solid "+color);
				//$(".cm[data-cid=\""+e.cid+"\"] > .badge-box").css("border","1px solid rgb(28, 173, 235)");
			});  
		}
	},
	init: {
		check: function(){
			plugSimple.logging.log("API exists: "+typeof API !== 'undefined',2);
			
			plugSimple.logging.log("API Check: "+(typeof API !== 'undefined' && API.enabled),2);
			if(typeof API !== 'undefined' && API.enabled){
				plugSimple.logging.success("API Check Succeeded.",2);
				clearTimeout(plugSimple.checkTimeout);
				plugSimple.init.main();
			}else{
				plugSimple.logging.warn("API Check Failed attempting again.",1);
				plugSimple.checkTimeout = setTimeout(function(){plugSimple.init.check();},1000);
			}
		},
		main: function(){
			var s = new Date().getTime();
			
			plugSimple.settings.verbose = 0;
			var total = 45;//45 from commits before transferring to the organization
			$.getJSON("https://api.github.com/repos/plugSimple/plugSimple/stats/commit_activity").then(function(e){
				for(var i in e){
					total += e[i].total;
					plugSimple.rawVersion = total;
				}
				plugSimple.VERSION = plugSimple.core.formatVersion(total);
				plugSimple.PREFIX = "[PlugSimple v"+plugSimple.VERSION+"]";
			});
						
			//LOAD EXTERNAL SCRIPTS
			//if(typeof plugInterface == "undefined"){plugSimple.logging.log("Loaded plugInterfaceAPI status "+$.getScript("https://rawgit.com/itotallyrock/PlugInterfaceAPI/master/plugInterfaceAPI.js").readyState,true);}
			if(typeof Command == "undefined"){
				$.getScript("https://rawgit.com/itotallyrock/PlugCommandAPI/master/plugCommandAPI.js").then(function(e){
					plugSimple.logging.success("Loaded plugCommandAPI",3);
					plugSimple.init.cmd();
				})
			}else{
				plugSimple.init.cmd();
			}
			if(localStorage.getItem("plugSimple") !== undefined && !(localStorage.getItem("plugSimple") == null || localStorage.getItem("plugSimple") == "null")){
				plugSimple.core.getSettings();
			}else{
				//plugSimple.core.getSettings();
				plugSimple.core.saveSettings();
			}
			
			if(plugSimple.settings.autowoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autodj){plugSimple.core.autoDJ();}
			
			$("#dj-button").html($("#dj-button").html()+"<div class=\"bottom\"><span class=\"plugSimple-eta\"></span></div>");
			$("#dj-button > .bottom").css("margin-top","-40px");
			
			plugSimple.core.chatStatus();
			
			plugSimple.tick = setInterval(function(){plugSimple.init.tick();plugSimple.tickNum++;},(1/plugSimple.tickRate)*1000);
			
			plugSimple.logging.success("Started in "+(new Date().getTime() - s)+"ms",1);
		},
		tick: function(){//WILL RUN EVERY TICKRATE
			var s = new Date().getTime();
			plugSimple.logging.log("TICK #"+plugSimple.tickNum,5);
			$(".plugSimple-eta").text(plugSimple.util.formatTime(plugSimple.core.getETA()));
			if(new Date().getTime() - s > (1/plugSimple.tickRate)*1000){
				plugSimple.logging.warn("Tick took longer than tickRate ("+(new Date().getTime() - s)+"ms)",1);
				plugSimple.init.stop(4);
			}
		},
		cmd: function(){//Initialize commands
			plugSimple.commands["settings"] = new Command("settings",["type"])
			plugSimple.commands["settings"].callback = function(a){
				a[0] = a[0].toLowerCase();
				console.log("typeof setting = "+typeof plugSimple.settings[a[0]]);
				if(typeof plugSimple.settings[a[0]] == "undefined"){throw new SyntaxError("Unknown Setting "+a[0]);}
				plugSimple.settings[a] = !plugSimple.settings[a[0]];
				plugInterface.chat("info",(plugSimple.settings[a[0]] ? "Enabled" : "Disabled")+" "+a[0]);
				plugSimple.logging.info((plugSimple.settings[a[0]] ? "Enabled" : "Disabled")+" "+a,2);
				plugSimple.init.update();
			};
			plugSimple.logging.log("Created settings Command",3);
		},
		update: function(){
			plugSimple.core.saveSettings();
			var q,
				s = new Date().getMilliseconds();
			
			for(q in API){
				if(typeof API[q] === "string"){
					API.off(API[q]);
				}
			}
			
			clearInterval(plugSimple.tick);
			plugSimple.tick = setInterval(function(){plugSimple.init.tick();plugSimple.tickNum++;},(1/plugSimple.tickRate)*1000);
			
			if(plugSimple.settings.autowoot){plugSimple.core.autoWoot();}
			if(plugSimple.settings.autodj){plugSimple.core.autoDJ();}
			
			plugSimple.core.chatStatus();
			
			plugSimple.logging.success("Ran update in "+(new Date().getMilliseconds() - s)+"ms",4);
		},
		stop: function(e){
			var s = new Date().getTime(),q,r,errCodes = ["undefined","Relaunching","Unknown Crash","Syntax Crash","Stuck in loop"];
			plugSimple.core.saveSettings();
			
			for(q in API){
				if(typeof API[q] === "string"){
					API.off(API[q]);
				}
			}
			
			for(r in plugSimple.commands){
				plugSimple.commands[r].destroy();
			}
			
			clearInterval(plugSimple.tick);
			$("[class^=\"plugSimple\"]").remove();
			$("#dj-button > .bottom").remove();
			if(e > 1){
				plugSimple.logging.error("plugSimple has stopped ("+(new Date().getTime() - s)+"ms) ["+errCodes[e]+"].",1);
			}else{
				plugSimple.logging.warn("plugSimple has stopped ("+(new Date().getTime() - s)+"ms) ["+errCodes[e]+"].",0);
			}
			delete plugSimple;
		}
	}
};
plugSimple.init.check();