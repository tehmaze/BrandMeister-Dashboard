var max_queue = 5;
var table = [];
var last = [];
var socket = io.connect('http://home.gigafreak.net:5001');
var targetgroup = 0;
loadGroups();

$('#group-list').live('change', function(e) {
  targetgroup = e.target.options[e.target.selectedIndex].value;
});

socket.on('connect', function () {
  var table = [];
  var last = [];
  socket.on('mqtt', function (msg) {
    var lastraw = JSON.parse(msg.payload);
    if (lastraw['DestinationID'] != targetgroup) { 
        return;
    }
    

    options = "";
    if (lastraw['LinkName'] == "D-Extra Link" || lastraw['LinkName'] == "DCS Link") {
        options = "<img src=images/avc/icon_D-STAR.png \>";
    }else{
        options = "<img src=images/avc/icon_DMR_w.png \>";
    }
    group = "";
    if (lastraw['CallTypes'].indexOf("Group") > -1) {
      group = '<img src="images/batch/users.png" \>';
    }else if(lastraw['CallTypes'].indexOf("Voice") > -1) {
      group = '<img src="images/batch/user.png" \>';
    }

    if (lastraw['SourceCall'] == '')
      lastraw['SourceCall'] = getGroupName(lastraw['SourceID'],lastraw['Master']);

    var scountry = getCountry(lastraw['SourceID']);
    var rcountry = getCountry(lastraw['ContextID']);
    var dcountry = getCountry(lastraw['DestinationID']);
    var ref = "";
    
    if (lastraw['SourceName'] == undefined || lastraw['SourceName'] == null || lastraw['SourceName'] == "") {
      var Source = CountryImage(scountry) +' ' + lastraw['SourceCall'] + ' (' + lastraw['SourceID'] + ')';
    } else {
      var Source = CountryImage(scountry) +' '+lastraw['SourceCall'] + ' [' + lastraw['SourceName'] + '] (' + lastraw['SourceID'] + ')' 
    }

    var timestamp = lastraw['Start'];
    var date = new Date(timestamp * 1000);
    var datetime = date.format('yyyy-mm-dd HH:MM:ss');

    var LossCount = "";
    if (lastraw['TotalCount']!=0 && lastraw['TotalCount'] != "undefined") {
      var _percent = Math.round(lastraw['LossCount'] / lastraw['TotalCount'] * 10000)/100;
      LossCount = _percent + "% (" + lastraw['LossCount'] + "/" + lastraw['TotalCount'] + ")";
    }
    //var entry = {
    //  'Time': datetime, 
    //  'Link name': lastraw['LinkName'],
    document.getElementById("options").innerHTML = TSimage(lastraw['Slot']) + ' ' + options;
    document.getElementById("time").innerHTML = datetime;
    document.getElementById("source").innerHTML = Source;
    document.getElementById("repeater").innerHTML = CountryImage(rcountry) + ' ' + lastraw['LinkCall'] + ' (' + lastraw['ContextID'] + ')';
    document.getElementById("destination").innerHTML = group + ' ' + CountryImage(dcountry) + ' ' + lastraw['DestinationCall'] + getGroupName(lastraw['DestinationID'],lastraw['Master']) +' (' + lastraw['DestinationID'] + ')';
  });
});

function loadGroups() {
  var grouplist = $('#group-list');
  for (var number in groups) {
    //doe dingen
    if (number <= 5000 && number >= 4000 || number < 100) continue;

    grouplist.append( new Option(groups[number] + ' ('+number+')',number) )
  }
}
