import { useState, useMemo } from 'react';
import { Search, Filter, Leaf, DollarSign, CheckCircle, Clock, Users, Award, MapPin, Building2, TrendingUp } from 'lucide-react';

const GovernmentSchemes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedScheme, setExpandedScheme] = useState(null);

  const schemes = [
    {
      id: 1,
      name: 'Pradhan Mantri Krishi Sinchayee Yojana',
      source: 'Central Government',
      category: 'irrigation',
      subsidy: '80%',
      maxAmount: '5,00,000',
      benefits: [
        'Subsidized drip and sprinkler irrigation systems',
        'Water conservation through micro-irrigation',
        'Increased crop yield by 30-40%',
        'Reduced water usage by 40-60%'
      ],
      eligibility: [
        'Land holders with 0.5 to 2 hectares',
        'Individual farmers and FPOs',
        'Proof of land ownership required'
      ],
      process: [
        'Apply through local agricultural department',
        'Submit land documents and aadhar',
        'Inspection and approval',
        'Subsidy disbursement after installation'
      ],
      contact: 'pmksy.gov.in'
    },
    {
      id: 2,
      name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
      source: 'Central Government',
      category: 'infrastructure',
      subsidy: '50%',
      maxAmount: '15,00,000',
      benefits: [
        'Development of agricultural infrastructure',
        'Solar powered agro-processing units',
        'Cold chain development',
        'Market linkage infrastructure'
      ],
      eligibility: [
        'Registered farmer groups and FPOs',
        'Minimum 10 members in group',
        'District as notified beneficiary'
      ],
      process: [
        'Group formation and registration',
        'Project proposal submission',
        'Department review and approval',
        'Fund disbursement in phases'
      ],
      contact: 'rkvy.nic.in'
    },
    {
      id: 3,
      name: 'Kisan Credit Card (KCC)',
      source: 'Central Government',
      category: 'credit',
      subsidy: 'Flexible Rates',
      maxAmount: '25,00,000',
      benefits: [
        'Easy credit access at 4% interest',
        'No collateral required for limits up to 1,00,000',
        'Flexible repayment terms',
        'Insurance coverage included'
      ],
      eligibility: [
        'Individual farmers and tenant farmers',
        'Landless agricultural laborers',
        'Registered partnership farms'
      ],
      process: [
        'Apply at nearest bank branch',
        'Submit income proof and land documents',
        'Quick approval within 7 days',
        'Card issued immediately'
      ],
      contact: 'pmkisan.gov.in'
    },
    {
      id: 4,
      name: 'Pradhan Mantri Fasal Bima Yojana',
      source: 'Central Government',
      category: 'insurance',
      subsidy: '50-80%',
      maxAmount: 'Claim Based',
      benefits: [
        'Complete crop insurance coverage',
        'Low premium rates (1.5% for cereals)',
        'Fast claim settlement within 2 months',
        'Covers pre and post-harvest losses'
      ],
      eligibility: [
        'All land-holding farmers',
        'Tenant and share-cropping farmers',
        'No upper limit on land size'
      ],
      process: [
        'Enroll through bank or insurance company',
        'Pay premium before sowing',
        'Register crop details',
        'Claim filing during crop loss'
      ],
      contact: 'pmfby.gov.in'
    },
    {
      id: 5,
      name: 'Keralam Startup Mission - Agri-Tech',
      source: 'Kerala State Government',
      category: 'technology',
      subsidy: 'Up to 100%',
      maxAmount: '25,00,000',
      benefits: [
        'Grant for agri-tech startups',
        'Business mentorship and training',
        'Access to incubation centers',
        'Marketing and export support'
      ],
      eligibility: [
        'Registered startup (within 7 years)',
        'Agri-tech based business model',
        'Minimum 2 team members',
        'Tech-driven agricultural solutions'
      ],
      process: [
        'Register on KSM portal',
        'Submit business plan and prototype',
        'Evaluation and selection',
        'Fund disbursement if approved'
      ],
      contact: 'keralastartupmission.com'
    },
    {
      id: 6,
      name: 'State Agriculture Department Subsidy Scheme',
      source: 'Kerala State Government',
      category: 'subsidy',
      subsidy: '40-50%',
      maxAmount: '2,50,000',
      benefits: [
        'Subsidized high-quality seeds',
        'Organic fertilizer support',
        'Improved agricultural implements',
        'Certified planting materials'
      ],
      eligibility: [
        'Small and marginal farmers',
        'Must be Kerala resident',
        'Land ownership proof required'
      ],
      process: [
        'Register with local panchayat',
        'Submit application to agriculture office',
        'Verification of details',
        'Subsidy amount credited'
      ],
      contact: 'keralaagriculture.gov.in'
    },
    {
      id: 7,
      name: 'Coconut Development Board (CDB) Scheme',
      source: 'Central Government',
      category: 'specialization',
      subsidy: '50%',
      maxAmount: '3,00,000',
      benefits: [
        'Modern coconut processing units',
        'Shade trees cultivation support',
        'Pest management training',
        'Market linkage for coconut products'
      ],
      eligibility: [
        'Coconut farmers',
        'Coconut land holdings minimum 0.5 hectare',
        'Progressive farmer registration'
      ],
      process: [
        'Enroll in CDB scheme',
        'Submit project proposal',
        'Site verification',
        'Equipment purchase and subsidy release'
      ],
      contact: 'coconutboard.gov.in'
    },
    {
      id: 8,
      name: 'Spice Board Schemes',
      source: 'Central Government',
      category: 'specialization',
      subsidy: '30-50%',
      maxAmount: '2,00,000',
      benefits: [
        'Support for spice cultivation',
        'Modern drying and processing equipment',
        'Quality certification assistance',
        'Export market connections'
      ],
      eligibility: [
        'Spice farmers in notified areas',
        'Minimum cultivation area 0.25 hectare',
        'Quality compliance certificates'
      ],
      process: [
        'Apply through district agriculture office',
        'Project approval process',
        'Equipment procurement assistance',
        'Subsidy payment after installation'
      ],
      contact: 'indianspices.com'
    },
    {
      id: 9,
      name: 'Soil Health Card Scheme',
      source: 'Central Government',
      category: 'sustainability',
      subsidy: '100% Free',
      maxAmount: 'No Cost',
      benefits: [
        'Free soil testing and analysis',
        'Customized fertilizer recommendations',
        'Increased crop productivity',
        'Reduced input costs'
      ],
      eligibility: [
        'All farmers with land holdings',
        'No income or land size limit',
        'Available for all crops'
      ],
      process: [
        'Visit local agriculture office',
        'Provide soil samples',
        'Laboratory testing (15 days)',
        'Receive health card with recommendations'
      ],
      contact: 'soilhealth.dac.gov.in'
    },
    {
      id: 10,
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      source: 'Central Government',
      category: 'income-support',
      subsidy: '6,000/year',
      maxAmount: '6,000 annually',
      benefits: [
        '2,000 per 4 months direct to bank account',
        'No conditions or eligibility restrictions',
        'Automatic enrollment for eligible farmers',
        'Income support for farming activities'
      ],
      eligibility: [
        'Landholding farmers',
        'Cultivators with land holdings',
        'Eligible up to 2 hectares'
      ],
      process: [
        'Register on pm-kisan.gov.in',
        'Or apply at local agricultural office',
        'Verification and approval',
        'Direct bank transfer every 4 months'
      ],
      contact: 'pmkisan.gov.in'
    },
    {
      id: 11,
      name: 'Organic Farming Scheme',
      source: 'Kerala State Government',
      category: 'sustainability',
      subsidy: '50-75%',
      maxAmount: '5,00,000',
      benefits: [
        'Conversion to organic farming support',
        'Organic fertilizer and pesticides subsidy',
        '3-year certification assistance',
        'Premium price guarantee for certified products'
      ],
      eligibility: [
        'Individual farmers',
        'Farmer groups and cooperatives',
        'Any farm size eligible',
        'Commitment to 3-year organic conversion'
      ],
      process: [
        'Apply through agriculture department',
        'Training in organic farming methods',
        'Certification process begins',
        'Subsidy released in phases'
      ],
      contact: 'keralaagriculture.gov.in'
    },
    {
      id: 12,
      name: 'Horticulture Mission Scheme',
      source: 'Kerala State Government',
      category: 'fruit-vegetables',
      subsidy: '40-50%',
      maxAmount: '4,00,000',
      benefits: [
        'High-value fruit and vegetable cultivation',
        'Modern greenhouse and nursery setup',
        'Drip irrigation for horticulture',
        'Certified saplings and seeds'
      ],
      eligibility: [
        'Farmers on 0.1 to 1 hectare land',
        'Young farmers preference given',
        'Agricultural background not necessary'
      ],
      process: [
        'Apply to district horticulture office',
        'Project proposal submission',
        'Site inspection and approval',
        'Financial assistance disbursement'
      ],
      contact: 'keralaagriculture.gov.in'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'irrigation', label: 'Irrigation' },
    { id: 'credit', label: 'Credit' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'technology', label: 'Technology' },
    { id: 'subsidy', label: 'Subsidy' },
    { id: 'specialization', label: 'Specialization' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'fruit-vegetables', label: 'Horticulture' },
    { id: 'income-support', label: 'Income Support' }
  ];

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getSourceColor = (source) => {
    return source === 'Central Government'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  const getIconForCategory = (category) => {
    const icons = {
      'irrigation': <Leaf className="w-5 h-5" />,
      'credit': <DollarSign className="w-5 h-5" />,
      'insurance': <Award className="w-5 h-5" />,
      'infrastructure': <Building2 className="w-5 h-5" />,
      'technology': <TrendingUp className="w-5 h-5" />,
      'subsidy': <DollarSign className="w-5 h-5" />,
      'specialization': <Leaf className="w-5 h-5" />,
      'sustainability': <Leaf className="w-5 h-5" />,
      'fruit-vegetables': <Leaf className="w-5 h-5" />,
      'income-support': <DollarSign className="w-5 h-5" />
    };
    return icons[category] || <Leaf className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-lg mb-6">
            <Award className="text-white" size={52} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Government Schemes for Kerala Farmers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore central and state government schemes offering subsidies, loans, and support for sustainable farming
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schemes by name or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-xl">
          <p className="text-sm text-blue-800">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{scheme.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSourceColor(scheme.source)}`}>
                      {scheme.source}
                    </span>
                  </div>
                  <div className="text-green-600">
                    {getIconForCategory(scheme.category)}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="text-gray-700">
                      <strong>Subsidy:</strong> {scheme.subsidy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={16} className="text-blue-600" />
                    <span className="text-gray-700">
                      <strong>Max Amount:</strong> ₹{scheme.maxAmount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  {expandedScheme === scheme.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedScheme === scheme.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-green-500 font-bold">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        Who Can Apply
                      </h4>
                      <ul className="space-y-2">
                        {scheme.eligibility.map((req, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-blue-500 font-bold">✓</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Clock size={18} className="text-orange-600" />
                        Application Process
                      </h4>
                      <ol className="space-y-2">
                                               {scheme.process.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-orange-500 font-bold">{idx + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-red-600" />
                        Contact Information
                      </h4>
                      <p className="text-sm text-gray-700 break-all">{scheme.contact}</p>
                    </div>

                    <a
                      href={`https://${scheme.contact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-center hover:shadow-lg transition-all"
                    >
                      Apply Now
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <Leaf size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No schemes found matching your search.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Quick Tips for Farmers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                Documents You'll Need
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Aadhar Card</li>
                <li>• Land ownership/lease documents</li>
                <li>• Bank account details</li>
                <li>• Income certificate</li>
                <li>• Caste certificate (if applicable)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                Pro Tips
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Apply early to avoid last-minute issues</li>
                <li>• Check eligibility before applying</li>
                <li>• Keep all documents organized</li>
                <li>• Follow up with local offices</li>
                <li>• Join farmer groups for better benefits</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Last Updated: December 2024 • For official information, visit respective government portals</p>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;