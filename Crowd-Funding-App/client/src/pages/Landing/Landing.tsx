import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Carousel from '../../components/carousel/Carousel';
import CampaignCard from '../../components/cards/CampaignCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import FeatureSection from '../../components/cards/FeatureSection';
import Footer from '../../components/footer/Footer';
import api from '../../api';
import type { ApiCampaign } from '../../types/campaignData';

export default function Landing() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get('/campaigns');
                // Get only active campaigns
                const activeCampaigns = response.data.data.filter(
                    (campaign: ApiCampaign) => campaign.status === 'active' || campaign.status === 'pending'
                );
                setCampaigns(activeCampaigns);
            } catch (err) {
                console.error('Failed to fetch campaigns:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= 300;
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += 300;
        }
    };

    return (
        <div>
            <Header />
            <Carousel />
            <section className="py-12 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Latest Campaigns</h2>
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[300px]">
                            <div className="text-xl text-gray-600">Loading campaigns...</div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="flex flex-col justify-center items-center min-h-[300px]">
                            <p className="text-xl text-gray-600 mb-4">No active campaigns yet.</p>
                            <button
                                onClick={() => navigate('/create-campaign')}
                                className="px-6 py-3 bg-[#6A5A82] text-white rounded-md hover:bg-opacity-90"
                            >
                                Start a Campaign
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={scrollLeft}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-[#6A5A82] rounded-full shadow-md p-2 cursor-pointer z-10"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div
                                ref={scrollContainerRef}
                                className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
                            >
                                {campaigns.map((campaign) => (
                                    <div key={campaign.campaign_id} className="flex-none w-72">
                                        <CampaignCard campaign={campaign} />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={scrollRight}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-[#6A5A82] rounded-full shadow-md p-2 cursor-pointer z-10"
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <div>
                <FeatureSection />
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}