export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-6 relative">
            About Civil Pro
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-blue-600"></span>
          </h1>

          <div className="prose max-w-none text-black">
            <p className="text-lg leading-relaxed mb-8">
              Civil Pro is a comprehensive suite of construction calculation
              tools designed for civil engineers, contractors, and construction
              professionals. Our platform combines precision with ease of use to
              streamline your construction calculations.
            </p>

            <h2 className="text-2xl font-semibold text-blue-800 mt-12 mb-6">
              Our Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Material Quantity Estimation",
                  description: "Accurate and efficient quantity takeoffs",
                },
                {
                  title: "Unit Conversion Tools",
                  description:
                    "Seamless conversion between different measurement units",
                },
                {
                  title: "Construction Calculators",
                  description: "Specialized tools for construction mathematics",
                },
                {
                  title: "Professional Accuracy",
                  description: "Precise calculations you can rely on",
                },
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
