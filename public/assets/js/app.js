
$(document).ready(function () {

    ///SCRAPE ARTICLES LISTENER
    $('.article-scrape').on('click', function () {

        $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(function(data) {
            location.reload()
        })
        
    });

    ////LISTENER TO SAVE ARTICLE (REMOVES FROM PAGE)
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
            selected.remove()
        })
    });


    ////CLEAR ALL ARTICLES
    $(".clear-all").on("click", function () {
        $.ajax({
            type: "GET",
            url: "/clearall",
          })
          .then(function(data) {
              document.location.reload(true) 
          })
    });

    ////DELETE SAVED ARTICLE (AND REMOVE FROM PAGE)
    $(document).on("click", ".delete-saved", function() {

        var id = $(this).attr("data-id")
        var selected = $(this).parent()

        $.ajax({
            type: "DELETE",
            url: "/saved/" + id
        })
        .then(function(data) {
            selected.remove()
        })
    })

    ////ACCESS, CREATE, OR DELETE AN ARTICLES' NOTE 
    $(document).on("click", ".article-notes", function() {

        var id = $(this).attr("data-id")

        $.ajax({
            type: "GET",
            url: "/saved/" + id
        })
        .then(function(data) {

            if (data.note) {
                for (var i = 0; i < data.note.length; i++) {
                    if (data.note[i].note) {
                        var $div = $('<div class="try">').append(data.note[i].note)
                        $div.append("<button class='remove-note' data-id=" + data.note[i]._id + ">delete</button>")
                        $('.modal-body').append($div)
                    }
                }
                
            }
            
            $(".modal-title").text("Notes for Article: " + data._id)
            $('.save-note').attr('data-id', data._id)
            $(".modal").toggle();
        })
    })



    ////SAVE A NEW NOTE
    $('.save-note').on('click', function() {

        var thisId = $(this).attr("data-id");
          
        $.ajax({
            method: "POST",
            url: "/saved/" + thisId,
            data: {
            note: $(".note").val()
            }
        })
            .then(function(data) {
            $(".modal-title").empty()
            $(".modal-body").empty()
            $(".note").val("")
            $(".modal").toggle();
            });
          
    })

    ///DELETE NOTE CLICK EVENT
    $(document).on("click", ".remove-note", function() {

        var selected = $(this).parent();
        var id = $(this).attr('data-id');

        $.ajax({
            type: "DELETE",
            url: "/note/" + id
        })
        .then(function(data) {
            selected.remove()
        })
    })



    ///CLOSE MODAL
    $(document).on("click", ".close", function() {
        $(".modal-title").empty()
            $(".modal-body").empty()
            $(".note").val("")
            $(".modal").toggle();
    })
    
//////End
});








