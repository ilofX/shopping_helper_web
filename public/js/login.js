

document.addEventListener('DOMContentLoaded', function() {

    // submit button handler
    document.getElementById("submit").addEventListener("click", () => {

        let data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };
    
        $.ajax({
            type: "POST",
            url: "/login",
            data: data,
            success: (data, textStatus) => {
                console.log(data, textStatus);
            },
            dataType: "json"
          });
    
    });




});


