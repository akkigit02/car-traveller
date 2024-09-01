document.addEventListener("DOMContentLoaded", function() {
    const packages = {
      ashtavinayak: {
        title: "Mumbai to Ashtavinayak Darshan",
        subtitle: "Ashtavinayak Darshan 3 days 2 Night package",
        images: [
          "assets/img/asht1.jpg",
          "assets/img/asht2.jpg",
          "assets/img/asht3.jpg"
        ],
        pricing: `
          <div>
            Sedan car with A/c <br />
            <strong>Rs 15700/- After discount Rs 13999/-</strong>
          </div>
          <div>
            Suv car with A/c <br />
            <strong>Rs 18399/- After Discount Rs 16299/-</strong>
          </div>
        `,
        description: `DDD CAB provide Mumbai to ashtavinayak darshan car on rent service will take you to a pilgrimage
          of eight Hindu temples in Maharashtra State of India that house eight distinct Ganesha idols, in a
          predetermined sequence located around Mumbai. Each of these temples has its own legendary tale,
          which separates them for its existence and spiritual value. Each idol of Lord Ganesha and his well-
          known trunk shaped face are distinctive from one another. However, the actual total distance one
          has to travel to and fro is about 950 – 1000 km from Mumbai, so it’s easier to hire cab service for
          Ashtavinayak Darshan from Mumbai. which is carried out within a span of two or three days. These
          temples are situated in the villages of Maharashtra, Morgaon, Siddhatek, Theur, Ranjangaon, Ozar,
          Lenyandri, Mahad and Pali. The personification of each and every murti of Ganesha and his trunk is
          special to each other. But at the other hand, there have been various shrines of eight Ganesha in
          various parts of Maharashtra; those near Pune are more likely to be recognized than the previous
          one. It is accepted to be the fruition of the Ashtavinayak Yatra visit of the first ganpati in the wake of
          the eight ganpati ‘s visit to finish the yatra again. The eight temples, referred to as Ashtavinayak in
          respective religious order are as follow : DDD CAB, as we are one of the best car rental service
          provider in thane, Mumbai. We provide Mumbai to Ashtavinayak Darshan Car on Rent service`, // Add full description here
        bookLink: "#booking-modal",
        
        valueData: 'ashtavinayak'
      },
      mahabaleshwar: {
        title: "Mumbai To Mahabaleshwar",
        subtitle: "Mumbai To Mahabaleshwar, 3 days 2 Night package",
        images: [
          "assets/img/maha1.jpg",
          "assets/img/maha2.webp",
          "assets/img/maha3.jpg"
        ],
        pricing: `
          <div>
            Sedan car with A/c <br />
            <strong>Rs 15700/- After discount Rs 13999/-</strong>
          </div>
          <div>
            Suv car with A/c <br />
            <strong>Rs 18399/- After Discount Rs 16299/-</strong>
          </div>
        `,
        description: `Visit With DDD CAB SERVICE Mahabaleshwar is a beautiful hill station that is nestled in the
          western ghats of Maharashtra. Book Mumbai to Mahabaleshwar Cabs with DDD CAB and
          enjoy luxury, premium cars at affordable prices. Book your ride with DDD CAB for a relaxing
          and hassle-free journey with our on-time service. This is a great place to come and relax for
          a few days and get away from busy city life. If you are planning to visit Mahabaleshwar then
          a smart thing to do would be to book a cab so you can cover up more places to see and
          make the most out of your trip here. One of the best places to visit when in Mahabaleshwar
          is the Mapro farms. You can check out the strawberry farms, go strawberry picking and even
          buy some products from their shop. There are some amazing food items that you can eat in
          Mahabaleshwar`, // Add full description here
        bookLink: "#booking-modal",
        valueData: 'mahabaleshwar'
      },
      dalhousieDharamshala:{
        title: 'Dalhousie Dharamshala'
      },
      sonmargGulmargPahalgamDalLake: {
        title: 'Sonmarg - Gulmarg, Pahalgam - Dal lake'
      },
      shimlaManali: {
        title: 'Shimla - Manali'
      },
      ayodhyaKashiBanarasPrayagraj : {
        title: 'Ayodhya, Kashi Banaras, Prayagraj'
      },
      jammuvaishnodeviPatnitopAmritsarWagaBorder: {
        title: 'Jammu-vaishnodevi - Patnitop, Amritsar - Waga Border'
      },
      kulluManaliKasol: {
        title: 'Kullu - Manali Kasol'
      },
      shimlaKulluManali: {
        title: 'Shimla Kullu Manali'
      }
    };
    document.getElementById('loginBtn').addEventListener('click', () => {
      window.location.href = 'http://127.0.0.1:3001'
  })
  
    document.querySelectorAll("[data-package]").forEach(button => {
      button.addEventListener("click", function() {
        const packageKey = this.getAttribute("data-package");
        const packageData = packages[packageKey];
  
        document.getElementById("modal-title").innerText = packageData.title;
        document.getElementById("modal-subtitle").innerText = packageData.subtitle;
        document.getElementById("modal-images").innerHTML = packageData.images
          .map(img => `<img class="w-100 h-120 rounded" src="${img}" />`)
          .join("");
        document.getElementById("modal-pricing").innerHTML = packageData.pricing;
        document.getElementById("modal-description").innerText = packageData.description;
        document.getElementById("modal-book-btn").setAttribute("data-book-package", packageData.valueData);
        document.getElementById("modal-book-link").setAttribute("href", packageData.bookLink);
        document.querySelectorAll("[data-book-package]").forEach(button => {
            button.addEventListener("click", function() {
              const packageKey = this.getAttribute("data-book-package");
              const packageData = packages[packageKey];
        
              // Populate the booking modal
              document.getElementById("booking-modal-title").innerText = `Book Now - ${packageData.title}`;
              document.getElementById("package").value = packageData.title;
            });
          });
      });
    });


     // Handle "Book Now" button clicks
  document.querySelectorAll("[data-book-package]").forEach(button => {
    button.addEventListener("click", function() {
      const packageKey = this.getAttribute("data-book-package");
      const packageData = packages[packageKey];
      console.log(packageKey,"===------")
      // Populate the booking modal
      document.getElementById("booking-modal-title").innerText = `Enquire Now - ${packageData.title}`;
      document.getElementById("package").value = packageData.title;
    });
  });

  // Handle form submission (example code, customize as needed)
  document.getElementById("booking-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      package: document.getElementById("package").value,
      date: document.getElementById("date").value
    };

    // Process booking form (e.g., send to server, display confirmation, etc.)
    console.log("Booking form submitted:", formData);
    await submitForm(formData)
  });

  const submitForm = async (formData) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/client/package`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
        });
            // Handle response
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      window.location.href = "#!";
      // Assuming the server sends a message field in the response
      alert(data.message || "Form submitted successfully!");
    } catch (error) {
        console.log(error)
        alert("There was an error submitting the form. Please try again.");
    }
  }

  window.addEventListener("load", function() {
    // Close the modal on page load/reload
    window.location.href = "#!";
  });
  });
  