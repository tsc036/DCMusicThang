$(document).ready(function() {
    $(".resultsContainer").append("<ol>Results</ol>");

    $("button").click(function() { // Button calls results function
        $("li").remove();
        results();
    });
});

function results() {
    for (let i = 1; i <= $(".quantity").val(); i++) {
        $("ol").append("<li></li>") // We will append artist/track name here
    }
}


