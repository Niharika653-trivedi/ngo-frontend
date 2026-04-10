const createCrudController = (Model, searchableFields = []) => ({
  async getAll(req, res) {
    const { q } = req.query;
    const filter = {};
    if (q && searchableFields.length) {
      filter.$or = searchableFields.map((field) => ({
        [field]: { $regex: q, $options: "i" },
      }));
    }
    const items = await Model.find(filter).sort({ createdAt: -1 });
    res.json(items);
  },
  async create(req, res) {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  },
  async update(req, res) {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(item);
  },
  async remove(req, res) {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted successfully" });
  },
});

module.exports = createCrudController;
