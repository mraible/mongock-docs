---
title: Registration
date: 2014-04-18 11:30:00 
permalink: /v5/pro/registration.html
eleventyNavigation:
  version: v5
  order: 1
---

<script>

  //WIP Code
  function sendRequest(){
    var url = "https://getform.io/f/2300119f-54b1-40b4-8018-45d439a9affe";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
          if (xhr.status == 302) {
            location.href = "/pro/registration.html";
          }
          if (xhr.status == 429) {
            alert ("You must wait 60 seconds");
          }
      }};

    var name = document.getElementById("name").value;
    var lastname = document.getElementById("lastName").value;
    var company = document.getElementById("company").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var title = document.getElementById("title").value;
    var feedback = document.getElementById("feedback").value;

    //ToDO: add validations

    var data = "name="+name+"&";
    var data += "lastname="+lastname+"&";
    var data += "company="+company+"&";
    var data += "email="+email+"&";
    var data += "phone="+phone+"&";
    var data += "title="+title+"&";
    var data += "feedback="+feedback;
              
    xhr.send(data);
  }
</script>

# Get your License Key to Access all the  <span class="professional">PRO</span> features. 

<table>
 <tr>
  <th>First Name:</th>
  <th><input type="text" id="name" name="name"/></th>
</tr>
<tr>
  <th>Last Name:</th>
  <th><input type="text" id="lastName" name="lastname"/></th>
</tr>
<tr>
  <th>Company:</th>
  <th><input type="text" id="company" name="company"/></th>
</tr>
<tr>
  <th>Email:</th>
  <th><input type="text" id="email" name="email"/></th>
</tr>
<tr>
  <th>Phone Number:</th>
  <th><input type="text" id="phone" name="phone"/></th>
</tr>
<tr>
  <th>Job Title:</th>
  <th><input type="text" id="title" name="title"/></th>
</tr>
<tr>
  <th>How did you hear of us?</th>
  <th><input type="text" id="feedback" name="feedback"/></th>
</tr>
</tr>
<th><button onClick="sendRequest();">Get my License Key</button> </th>
</tr>
</table>


# Questions? 

Please feel free to ask us [here](mailto:dev@cloudyrock.io) if there is anything that the Mongock team can help you with. 