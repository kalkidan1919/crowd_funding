import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import bg from "../../assets/images/bg.jpg";
import donation from "../../assets/images/donate.jpg";
import api from "../../api";
import type { ApiCampaign } from "../../types/campaignData";

// Import payment method icons
import applePay from "../../assets/images/apple-pay.png";
import mastercard from "../../assets/images/card.png";
import visa from "../../assets/images/visa.png";
import paypal from "../../assets/images/paypal.png";

interface LocationState {
  campaign?: ApiCampaign;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { campaign } = state || {};

  const [amount, setAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAmountClick = (value: string) => {
    setAmount(value);
    setCustomAmount("");
    setError("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount(value);
    setError("");
  };

  const total = parseFloat(amount || "0").toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaign) {
      setError("No campaign selected.");
      return;
    }

    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await api.post("/contributions", {
        campaign_id: campaign.campaign_id,
        amount: contributionAmount,
        // reward_id is optional and currently not implemented in the UI selection
        // but the backend supports it if needed in future.
      });

      setShowModal(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to process donation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };

  return (
    <div className="font-sans" style={backgroundStyle}>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
          aria-label="Exit"
        >
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>
      </div>

      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center py-10">
          <h2 className="text-5xl font-bold text-gray-800">Donation</h2>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 w-full max-w-4xl mx-auto space-y-8">
          <div className="flex items-center space-x-6">
            <img
              src={donation}
              alt="Donation Cause"
              className="rounded-lg shadow w-32"
            />
            <div>
              <p className="text-lg text-gray-700">
                You're supporting{" "}
                <span className="font-semibold">
                  {campaign?.title || "a worthy cause"}
                </span>
              </p>
              <p className="text-lg text-gray-700">
                Benefitting:{" "}
                <span className="font-semibold">{campaign?.title}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Personal Info
                </h3>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name*
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5A82] transition-all"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name*
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5A82] transition-all"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5A82] transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Payment Method
                </h3>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <img src={applePay} alt="Apple Pay" className="h-6" />
                <img src={mastercard} alt="Mastercard" className="h-6" />
                <img src={visa} alt="Visa" className="h-6" />
                <img src={paypal} alt="PayPal" className="h-6" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Card Number*
                </label>
                <input
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5A82] transition-all"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  CVV*
                </label>
                <input
                  type="text"
                  placeholder="***"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5A82] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Donation Amount
              </label>
              <div className="flex flex-wrap gap-3">
                {["5", "10", "50", "100", "500"].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => handleAmountClick(value)}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                      amount === value
                        ? "bg-[#6A5A82] text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    ${value}
                  </button>
                ))}
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Custom"
                  className="flex-1 min-w-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5A82]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-lg font-bold text-gray-800 mt-6 pt-6 border-t">
              <span>Donation Total</span>
              <span>${total}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-8 rounded-full text-white font-semibold text-lg shadow-lg transform transition hover:scale-105 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6A5A82] hover:bg-[#584C69]"
              }`}
            >
              {isSubmitting ? "Processing..." : "Donate Now"}
            </button>
          </form>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your donation of ${total} to "{campaign?.title}" has been
              successfully processed.
            </p>
            <button
              onClick={() => navigate(`/project/${campaign?.campaign_id}`)}
              className="w-full bg-[#6A5A82] text-white font-semibold py-3 rounded-lg hover:bg-[#584C69] transition-all"
            >
              Back to Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
