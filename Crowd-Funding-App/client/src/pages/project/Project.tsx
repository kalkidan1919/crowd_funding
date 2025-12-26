// src/pages/project/Project.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import image from "../../assets/images/Banner.png";
import donateBg from "../../assets/images/bg.jpg";
import api from "../../api";
import type { ApiCampaign } from "../../types/campaignData";

export default function Project() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [campaign, setCampaign] = useState<ApiCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading campaign...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">
            {error || "Campaign not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#6A5A82] text-white rounded-md hover:bg-opacity-90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (campaign.current_amount / campaign.target_amount) * 100;
  const daysRemaining = Math.ceil(
    (new Date(campaign.end_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleContribute = () => {
    navigate("/payment", { state: { campaign } });
  };

  const handleExit = () => {
    navigate("/");
  };

  const contentBackgroundStyle = {
    backgroundImage: `url(${donateBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "overlay",
  };

  return (
    <div>
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Exit Button at the top right */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleExit}
            className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
            aria-label="Exit"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>

        <div
          className="max-w-6xl mx-auto rounded-lg shadow-xl p-8 relative"
          style={contentBackgroundStyle}
        >
          {/* Campaign Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              {campaign.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {campaign.description?.substring(0, 100)}...
            </p>
            <div className="mt-4 text-gray-500">
              <span className="font-medium">Status:</span> {campaign.status}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Campaign Story & Description */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={campaign.image_url || image}
                  alt="Campaign Image"
                  className="w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = image;
                  }}
                />
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Campaign Story
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Funding and Rewards */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="text-center">
                  <h3 className="text-3xl font-extrabold text-[#6A5A82]">
                    ${campaign.current_amount.toLocaleString()}
                  </h3>
                  <p className="text-lg text-gray-500">
                    pledged of ${campaign.target_amount.toLocaleString()} target
                  </p>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#6A5A82] h-3 rounded-full"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-500 text-sm">
                    <span className="font-bold text-gray-800">
                      {daysRemaining > 0 ? daysRemaining : 0}
                    </span>{" "}
                    days to go
                  </p>
                </div>
                <button
                  onClick={handleContribute}
                  className="mt-6 w-full py-3 px-4 rounded-md text-white font-semibold bg-[#6A5A82] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5A82]"
                  disabled={
                    campaign.status !== "active" &&
                    campaign.status !== "pending"
                  }
                >
                  {campaign.status === "active" || campaign.status === "pending"
                    ? "Contribute"
                    : "Campaign Ended"}
                </button>
              </div>

              {/* Rewards Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Rewards</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <p className="text-lg font-bold text-gray-800">$25+</p>
                  <h4 className="font-semibold text-gray-700 mt-2">
                    Digital Thank You Note
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Receive a heartfelt digital thank you note from the creator
                    and a mention on our project website.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <p className="text-lg font-bold text-gray-800">$50+</p>
                  <h4 className="font-semibold text-gray-700 mt-2">
                    Exclusive T-shirt
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Get an exclusive, limited-edition project T-shirt.
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Limited to 100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
