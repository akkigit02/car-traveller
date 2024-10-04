document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value,
    };
    await submitForm(formData)
  });

  const submitForm = async (formData) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/client/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
        });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      window.location.href = "#!";

      alert(data.message || "Form submitted successfully!");
    } catch (error) {
        console.log(error)
        alert("There was an error submitting the form. Please try again.");
    }
  }

  window.addEventListener("load", function() {
    window.location.href = "#!";
  });