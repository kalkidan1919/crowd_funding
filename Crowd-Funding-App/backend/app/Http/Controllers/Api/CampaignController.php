public function store(Request $request): JsonResponse
{
    $request->validate(['title' => 'required', 'target_amount' => 'required']);
    $campaign = Campaign::create(array_merge($request->all(), ['creator_id' => $request->user()->user_id]));
    return response()->json($campaign, 201);
}
public function show(string $id): JsonResponse
{
    $campaign = Campaign::findOrFail($id);
    return response()->json($campaign);
}
public function index(Request $request): JsonResponse
{
    $query = Campaign::query();
    if ($request->has('creator_id')) { $query->where('creator_id', $request->creator_id); }
    return response()->json($query->paginate(10));
}