let inputUser;
let value;
let userFound;

let a = $("#exampleFormControlInput1");
a.on("input", function () {
  inputUser = $(this).val();
});

const apiURl = "https://api.github.com/users";

$.ajax({
  url: apiURl,
  method: "GET",
  dataType: "json",
  success: function (data) {
    value = data;
  },
});

let button = $(".buttonbhai");
button.on("click", function () {
  let d = inputUser;
  userFound = value.find((item) => {
    return item.login === d;
  });
  if (userFound) {
    localStorage.setItem("userFound", JSON.stringify(userFound));
    window.location.href = "./user.html";
  } else {
    alert("User Not Found");
  }
});
