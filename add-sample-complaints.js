// Script to add sample complaints to localStorage for testing
const sampleComplaints = [
  {
    id: "1",
    fullName: "John Doe",
    ward: "Ramnagar",
    complaintType: "Leakage",
    details: "Water leaking from pipe",
    submittedAt: "12/11/2024, 2:30:00 PM",
    status: "pending" // This will show as Pending
  }
];

localStorage.setItem('complaints', JSON.stringify(sampleComplaints));
console.log('Sample complaint added to localStorage');