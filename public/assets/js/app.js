
$(document).ready(function () {

    ///Scrape Articles Listener
    $('.article-scrape').on('click', function () {

        $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(function(data) {
            // console.log(data)
            location.reload()
        })
        
    });

    ////Listener to Save Article and remove from page
    $(document).on("click", ".save-article", function() {

        var selected = $(this).parent();
        var id = $(this).attr("data-id");
        var title = $(this).attr("data-title")
        var link = $(this).attr("data-link")
        var date = $(this).attr("data-date")

        $.ajax({
            method: "POST",
            url: "/saved",
            data: {
                id: id,
                title: title,
                link: link,
                date: date
            }
        })
        .then(function(data) {
            // console.log(data)
            selected.remove()
            console.log('working?')
        })
    });


    ////Clear All Articles Listener
    $(".clear-all").on("click", function () {
        $.ajax({
            type: "GET",
            url: "/clearall",
          })
          .then(function(data) {
              document.location.reload(true) 
          })
    });

    ////Delete Saved Article
    $(document).on("click", ".delete-saved", function() {

        var id = $(this).attr("data-id")
        var selected = $(this).parent()

        $.ajax({
            type: "DELETE",
            url: "/saved/" + id
        })
        .then(function(data) {
            selected.remove()
            console.log("article " + id + " deleted from Saved")
        })
    })
    
//////End
});






