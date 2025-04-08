// Assemble final post data
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  console.log("Formatted date:", `${day}/${month}/${year} ${hours}:${minutes}`); // Debugging line
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

module.exports = {
  formatDate,
};
