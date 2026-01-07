public function store(Request $request): JsonResponse
{
    $contribution = Contribution::create([...$request->all(), 'backer_id' => $request->user()->user_id]);
    Campaign::find($request->campaign_id)->increment('current_amount', $request->amount);
    return response()->json($contribution, 201);
}
public function index(): JsonResponse
{
    // Usually filtered by backer_id in a real app
    return response()->json(Contribution::with('campaign')->paginate(10));
}