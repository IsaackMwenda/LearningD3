const progress_fs = firebase.firestore();
const settings = {timestampsInSnapshots: true};
progress_fs.settings(settings);
progress_fs.doc('metrics/coda').onSnapshot(res => {
    update_progress_ui(res.data());
});
function update_progress_ui(data) {
    console.log("update_ui: " + JSON.stringify(data));
    var status_body = document.getElementById('coding_status_body');
    while (status_body.firstChild) {
        status_body.removeChild(status_body.firstChild);
    }
    last_update = data["last_update"]
    document.getElementById('last_update').innerText = "Last updated: " + last_update
    for (var dataset_id in data["coding_progress"]) {
        var messages_count = data["coding_progress"][dataset_id]["messages_count"]
        var messages_with_label = data["coding_progress"][dataset_id]["messages_with_label"]
        //dataset_url=<a href="https://web-coda.firebaseapp.com/?dataset="+dataset_id>dataset_id</a>
        var dataset_url = document.createElement("a")
            dataset_url.setAttribute("href", "https://web-coda.firebaseapp.com/?dataset="+dataset_id)
           
            function createTextLinks_(text) {
  
                return (text || "").replace(
                  /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
                  function(match, space, dataset_url){
                    var hyperlink = dataset_url;
                    if (!hyperlink.match('^https?:\/\/')) {
                      hyperlink = 'http://' + hyperlink;
                      
                    }
                    return space + '<a href="' + hyperlink + '">' + dataset_id + '</a>';
                    
                  }
                );
                
              };
              createTextLinks_(dataset_url);
              

        rw = status_body.insertRow()
        //rw.insertCell().innerHTML = hyperlink
        rw.insertCell().innerText = messages_count
        rw.insertCell().innerText = messages_with_label
        rw.insertCell().innerText = (100 * messages_with_label / messages_count).toFixed(2) + '%'
        console.log(dataset_id, messages_count, messages_with_label);
    //Formating the rows based on cell value
        $(document).ready(function(){
            //Grab the cells of the last rows
            $('#codingtable td:nth-child(4)').each(function() {
               var Done = $(this).text();
                //Style the entire row conditionally based on the cell value
                if ((parseFloat(Done) >= 0) && (parseFloat(Done) <= 25)) {
                    $(this).parent().addClass('coding-below25'); 
                }
                else if((parseFloat(Done) > 25) && (parseFloat(Done) <= 50)) {
                    $(this).parent().addClass('coding-above25'); 
                }
                else if((parseFloat(Done)> 50) && (parseFloat(Done) <= 75)) {
                    $(this).parent().addClass('coding-above50'); 
                }
                else if((parseFloat(Done) > 75) && (parseFloat(Done) <100)) {
                    $(this).parent().addClass('coding-above75'); 
                }
                else {
                    $(this).parent().addClass('coding-complete'); 
                }
            });
        });
        //Table sorting using tablesorter plugin based on fraction of message labelling complete
        $(function() {
            $("#codingtable").tablesorter({
                //sorting on page load, column four in descending order i.e from least coded to most coded.
                    sortList : [[3,0]]
            });
        });   
    }
}
