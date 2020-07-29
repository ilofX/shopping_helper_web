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
            dataType: "json",
            success: (data, textStatus) => {
                //console.log(data, textStatus);
                if (data.status) {
                    document.getElementById("login-message").innerHTML = data.message;
                    document.getElementById("login-message").classList.remove('fail');
                    document.getElementById("login-message").classList.add('success');
                    window.location.href = "/dash";
                } else {
                    document.getElementById("login-message").innerHTML = data.message;
                    document.getElementById("login-message").classList.remove('success');
                    document.getElementById("login-message").classList.add('fail');
                }
            }
        });
    
    });


});


