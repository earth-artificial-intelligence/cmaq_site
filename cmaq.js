function parse_date_string(str) {
    var y = str.substr(0,4),
        m = str.substr(4,2) - 1,
        d = str.substr(6,2);
    var D = new Date(y,m,d);
    return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
}

function show_metrics_table(date_str){

    $("#metric_table tr").remove()

    $.get(
        "evaluation/eval_"+date_str+".txt", 
        function( data ) {

            let therow = data.replace(/,/g, "</td><td>")
            
            if($("#metrics_result").html()=== ""){
                    // if the table is empty
                    $("#metrics_result").append(`<table class="table" >
                    <thead>
                    <tr>
                        <th>model</th>
                        <th>sdate</th>
                        <th>dimsizes(tt)</th>
                        <th>avg(oO324(tt))</th>
                        <th>avg(mO324(tt))</th>
                        <th>rmse</th>
                        <th>corr</th>
                        <th>nmb</th>
                        <th>nme</th>
                        <th>mb</th>
                        <th>me</th>
                        <th>ah</th>
                        <th>afar</th>
                    </tr>
                    </thead>
                    <tbody id="metric_table">
                    </tbody>
                    </table>`)
                
            }
            let rowcont = `<tr>
                        <td>AI</td>
                        <td>`
                        +therow+
                        `</td>
                    </tr>`;

            console.log("ai rowcont: "+ rowcont)

            $("#metric_table").append(rowcont);
        }
    )
    // $("#cmaq_metrics_result").html("missing");
    $.get(
        "evaluation/alleva_12km_o3_fore.txt", 
        function( data ) {

            //parse csv into array
            let array = data.split(/\r\n|\n|\r/)

            //find the row of the day

            let found_cmaq_metrics_rows = []
            
            for (let i = 0; i < array.length; i++) {
                if(array[i].includes(date_str)){
                    found_cmaq_metrics_rows.push(array[i]);
                }
                    
            }

            if(found_cmaq_metrics_rows.length==0){

                alert("No metrics found for CMAQ of the day: "+date_str)

            }else{

                if($("#metrics_result").html()=== ""){
                    // if the table is empty
                    $("#metrics_result").append(`<table class="table" id="metric_table">
                        <thead>
                            <tr>
                                <th>model</th>
                                <th>sdate</th>
                                <th>dimsizes(tt)</th>
                                <th>avg(oO324(tt))</th>
                                <th>avg(mO324(tt))</th>
                                <th>rmse</th>
                                <th>corr</th>
                                <th>nmb</th>
                                <th>nme</th>
                                <th>mb</th>
                                <th>me</th>
                                <th>ah</th>
                                <th>afar</th>
                            </tr>
                        </thead>
                        <tbody id="metric_table">
                        </tbody>
                    </table>`)
                }

                let found_cmaq_metrics_row = found_cmaq_metrics_rows[0]

                found_cmaq_metrics_row = found_cmaq_metrics_row.replace(/,/g, "</td><td>")

                let rowcont = `<tr>
                            <td>CMAQ</td>
                            <td>`
                            +found_cmaq_metrics_row+
                            `</td>
                        </tr>`;

                console.log("cmaq rowcont: "+rowcont)

                $("#metric_table").append(rowcont);

            }

            
        }
    )

}

$.get(
    
    "gifs/filelist.txt", 
    
    function( data ) {

        var lines = data.split('\n');
        var start_date = null;
        var end_date = null;
        for(var i = 0;i < lines.length;i++){
            if(lines[i].includes("Airnow_")){
                datestr = lines[i].substring("Airnow_".length);
                datestr = datestr.split(".")[0]
                current_date = parse_date_string(datestr);
                if(start_date == null ){
                    start_date = current_date
                }
                if(end_date == null ){
                    end_date = current_date
                }
                if(current_date<start_date){
                    start_date = current_date
                }
                if(current_date>end_date){
                    end_date = current_date
                }
            }
        }

        $('#datepicker').datepicker({
            format: 'mm-dd-yyyy',
            startDate: start_date,
            endDate: end_date,
            todayBtn: 'linked',
        }).on('changeDate', function(ev){
            console.log(ev.date)
            const yyyy = ev.date.getFullYear();
            let mm = ev.date.getMonth()+1; // Months start at 0!
            let dd = ev.date.getDate();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            const formattedToday = yyyy.toString()+ mm.toString() + dd.toString() ;
            console.log("formattedToday"+formattedToday)
            $("#cmaq_ai_map").attr("src","gifs/Map_"+formattedToday+".gif");
            $("#cmaq_raw_map").attr("src","gifs/FORECAST_O3_"+formattedToday+".gif");
            $("#cmaq_ai_airnow_map").attr("src","gifs/Airnow_"+formattedToday+".gif");
            $("#cmaq_raw_airnow_map").attr("src","gifs/OBS-FORECAST_O3_"+formattedToday+".gif");

            $("#ai_eva_metrics").click(function(){
                show_metrics_table(formattedToday);
            });

            $("#cmaq_eva_metrics").click(function(){
                show_metrics_table(formattedToday);
            })

            $("#metrics_result").html("");
            
            $('#datepicker').datepicker('hide');
        });

        $('#datepicker').datepicker('update', end_date);

        $('#datepicker').datepicker('setDate', end_date);

    }
)
