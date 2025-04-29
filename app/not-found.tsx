import LandLordLayout from "@/app/components/layout/LandLordLayout";

const ComingSoonPage = () => {
  return (
    <LandLordLayout>
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">🚧 Coming Soon</h1>
          <p className="text-lg text-gray-600">
            This page is currently under construction. Check back later!
          </p>
        </div>
      </div>
    </LandLordLayout>
  );
};

export default ComingSoonPage;
