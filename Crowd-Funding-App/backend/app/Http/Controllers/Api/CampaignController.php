public function store(Request $request): JsonResponse
{
    $request->validate(['title' => 'required', 'target_amount' => 'required']);
    $campaign = Campaign::create(array_merge($request->all(), ['creator_id' => $request->user()->user_id]));
    return response()->json($campaign, 201);
}
