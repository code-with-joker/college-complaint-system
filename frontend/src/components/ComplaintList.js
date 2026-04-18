import ComplaintCard from "./ComplaintCard";

export default function ComplaintList({ data, loading }) {

  // ⏳ Loading state
  if (loading) {
    return <p className="mt-6 text-gray-500">Loading complaints...</p>;
  }

  // 🚫 No data
  if (!data || data.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        🚫 No complaints found
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-5 mt-6">
      {data.map((item, index) => (
        <ComplaintCard key={index} item={item} />
      ))}
    </div>
  );
}