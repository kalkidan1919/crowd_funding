import { useNavigate } from 'react-router-dom';
import type { ApiCampaign } from '../../types/campaignData';

interface CampaignCardProps {
    campaign: ApiCampaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
    const progress = (campaign.current_amount / campaign.target_amount) * 100;
    const formattedRaised = `$${campaign.current_amount.toLocaleString()}`;
    const formattedTarget = `$${campaign.target_amount.toLocaleString()}`;
    const navigate = useNavigate();

    const handleNav = () => {
        navigate(`/project/${campaign.campaign_id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img
                src={campaign.image_url || 'https://via.placeholder.com/400x300'}
                alt={campaign.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300';
                }}
            />
            <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{campaign.title}</h3>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-sm text-gray-600">{formattedRaised}</p>
                        <p className="text-xs text-gray-500">raised of {formattedTarget} Target</p>
                    </div>
                    <div className="text-xs text-gray-500">{progress.toFixed(0)}%</div>
                </div>
                <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden mb-3">
                    <div
                        className="bg-[#6A5A82] h-full absolute left-0 top-0 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                {campaign.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{campaign.description}</p>
                )}
            </div>
            <div className="bg-gray-100 p-4">
                <button
                    className="bg-[#6A5A82] hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-md w-full text-sm"
                    onClick={handleNav}
                >
                    Read More & Donate
                </button>
            </div>
        </div>
    );
}

export default CampaignCard;