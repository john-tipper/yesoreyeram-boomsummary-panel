System.register(["lodash", "./../utils/AppUtils", "./../utils/BoomUtils", "./../utils/GrafanaUtils", "../utils/BoomUtils"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var lodash_1, AppUtils_1, BoomUtils_1, GrafanaUtils_1, BoomUtils_2, buildMasterData, BoomFilter, BoomSummaryFilter, BoomSummaryConditionalFormats, BoomStat, BoomStatsGroup, replaceStatsFromTemplate, replaceFATokens, getMatchingCondition;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (AppUtils_1_1) {
                AppUtils_1 = AppUtils_1_1;
            },
            function (BoomUtils_1_1) {
                BoomUtils_1 = BoomUtils_1_1;
            },
            function (GrafanaUtils_1_1) {
                GrafanaUtils_1 = GrafanaUtils_1_1;
            },
            function (BoomUtils_2_1) {
                BoomUtils_2 = BoomUtils_2_1;
            }
        ],
        execute: function () {
            exports_1("buildMasterData", buildMasterData = function (data) {
                var masterdata = [];
                lodash_1.default.each(data, function (d) {
                    if (d.type === "table") {
                        var refId_1 = d.refId;
                        lodash_1.default.each(d.rows, function (row, i) {
                            var group = [];
                            lodash_1.default.each(row, function (col, j) {
                                var mydata = {
                                    colname: d.columns[j].text,
                                    refId: refId_1,
                                    rowid: +i,
                                    value: col
                                };
                                group.push(mydata);
                            });
                            masterdata.push(group);
                        });
                    }
                    else {
                        console.error("ERROR: Only table format is currently supported");
                    }
                });
                return masterdata;
            });
            BoomFilter = (function () {
                function BoomFilter(options) {
                    this.getSecondaryFieldDetails = function (operator) {
                        var CanShowValue2 = false;
                        var Value1Helper = "Value";
                        var Value2Helper = "";
                        switch (operator.replace("ignorecase", "").trim()) {
                            case "between":
                                CanShowValue2 = true;
                                Value1Helper = "From";
                                Value2Helper = "To";
                                break;
                            case "insiderange":
                                CanShowValue2 = true;
                                Value1Helper = "From";
                                Value2Helper = "To";
                                break;
                            case "outsiderange":
                                CanShowValue2 = true;
                                Value1Helper = "From";
                                Value2Helper = "To";
                                break;
                            case "in":
                                CanShowValue2 = true;
                                Value1Helper = "Values";
                                Value2Helper = "Seperator";
                                break;
                            default:
                                break;
                        }
                        return {
                            CanShowValue2: CanShowValue2,
                            Value1Helper: Value1Helper,
                            Value2Helper: Value2Helper
                        };
                    };
                    this.field = options.field || "Sample";
                    this.operator = options.operator || "equals";
                    this.value = options.value || "Something";
                    this.value2 = options.value2 || "";
                }
                return BoomFilter;
            }());
            exports_1("BoomFilter", BoomFilter);
            BoomFilter.prototype.GetValue1Helper = function () {
                return this.getSecondaryFieldDetails(this.operator).Value1Helper;
            };
            BoomFilter.prototype.GetValue2Helper = function () {
                return this.getSecondaryFieldDetails(this.operator).Value2Helper;
            };
            BoomFilter.prototype.CanShowValue2 = function () {
                return this.getSecondaryFieldDetails(this.operator).CanShowValue2;
            };
            BoomSummaryFilter = (function (_super) {
                __extends(BoomSummaryFilter, _super);
                function BoomSummaryFilter(options) {
                    return _super.call(this, options) || this;
                }
                return BoomSummaryFilter;
            }(BoomFilter));
            exports_1("BoomSummaryFilter", BoomSummaryFilter);
            BoomSummaryConditionalFormats = (function (_super) {
                __extends(BoomSummaryConditionalFormats, _super);
                function BoomSummaryConditionalFormats(options) {
                    var _this = _super.call(this, options) || this;
                    _this.custom_css_class = options.custom_css_class || "";
                    _this.stat_type = options.stat_type || "first";
                    _this.bgColor = options.bgColor || "";
                    _this.textColor = options.textColor || "";
                    return _this;
                }
                return BoomSummaryConditionalFormats;
            }(BoomFilter));
            exports_1("BoomSummaryConditionalFormats", BoomSummaryConditionalFormats);
            BoomStat = (function () {
                function BoomStat(options) {
                    this.field = options.field || "Sample";
                    this.stat_type = options.stat_type || "first";
                    this.format_as = options.format_as || "string";
                    this.decimals = options.decimals || "0";
                    this.unit = options.unit || "none";
                    this.title = options.title || this.stat_type + " of " + this.field || "Detail";
                }
                return BoomStat;
            }());
            exports_1("BoomStat", BoomStat);
            BoomStat.prototype.setUnitFormat = function (format) {
                this.unit = format && format.value ? format.value : "none";
            };
            BoomStatsGroup = (function () {
                function BoomStatsGroup(options) {
                    this.title = options.title || "";
                    this.stats = options.stats || [];
                    this.statWidth = options.statWidth || "100";
                    this.bgColor = options.bgColor || "";
                    this.textColor = options.textColor || "";
                    this.templateType = options.templateType || "default";
                    this.customTemplate = options.customTemplate || "<div style=\"width:100%;float:left;border:1px solid black;\">\n            <div style=\"width:50%;float:left;padding:10px;\">Total Records</div>\n            <div style=\"width:50%;float:left;padding:10px;\">#{count}</div>\n        </div>";
                    this.filters = options.filters || [];
                    this.conditional_formats = options.conditional_formats || [];
                }
                return BoomStatsGroup;
            }());
            exports_1("BoomStatsGroup", BoomStatsGroup);
            BoomStatsGroup.prototype.addStat = function () {
                var newMetric = new BoomStat({});
                this.stats = this.stats || [];
                this.stats.push(newMetric);
            };
            BoomStatsGroup.prototype.removeStat = function (index) {
                if (this.stats.length > 0) {
                    this.stats.splice(Number(index), 1);
                }
            };
            BoomStatsGroup.prototype.addFilter = function () {
                var newfilter = new BoomSummaryFilter({
                    field: "Sample",
                    operator: "equals"
                });
                this.filters = this.filters || [];
                this.filters.push(newfilter);
            };
            BoomStatsGroup.prototype.removeFilter = function (index) {
                if (this.filters.length > 0) {
                    this.filters.splice(Number(index), 1);
                }
            };
            BoomStatsGroup.prototype.addConditonalFormat = function () {
                var new_conditional_formatter = new BoomSummaryConditionalFormats({
                    operator: "equals",
                    stat_type: "first"
                });
                this.conditional_formats = this.conditional_formats || [];
                this.conditional_formats.push(new_conditional_formatter);
            };
            BoomStatsGroup.prototype.removeConditionalFormat = function (index) {
                if (this.conditional_formats.length > 0) {
                    this.conditional_formats.splice(Number(index), 1);
                }
            };
            BoomStatsGroup.prototype.moveConditionalFormat = function (direction, index) {
                var tempElement = this.conditional_formats[Number(index)];
                if (direction === "UP") {
                    this.conditional_formats[Number(index)] = this.conditional_formats[Number(index) - 1];
                    this.conditional_formats[Number(index) - 1] = tempElement;
                }
                if (direction === "DOWN") {
                    this.conditional_formats[Number(index)] = this.conditional_formats[Number(index) + 1];
                    this.conditional_formats[Number(index) + 1] = tempElement;
                }
            };
            replaceStatsFromTemplate = function (template, stats, data) {
                var output = template;
                lodash_1.default.each(stats, function (stat, index) {
                    var mystatsObject = {
                        count: NaN,
                        first: "",
                        max: NaN,
                        mean: NaN,
                        min: NaN,
                        sum: NaN,
                        uniquecount: NaN,
                    };
                    if (data) {
                        var mystats_1 = [];
                        lodash_1.default.each(data, function (group) {
                            var matching_field = lodash_1.default.filter(group, function (g) { return g.colname === stat.field; });
                            if (matching_field.length > 0) {
                                mystats_1.push(lodash_1.default.first(matching_field).value);
                            }
                        });
                        mystatsObject = BoomUtils_1.getStatsFromArrayOfObjects(mystats_1);
                    }
                    if (index === 0) {
                        output = output.replace(new RegExp("#{count}", "gi"), mystatsObject.count);
                        output = output.replace(new RegExp("#{uniquecount}", "gi"), mystatsObject.uniquecount);
                        output = output.replace(new RegExp("#{sum}", "gi"), mystatsObject.sum);
                        output = output.replace(new RegExp("#{mean}", "gi"), mystatsObject.mean);
                        output = output.replace(new RegExp("#{min}", "gi"), mystatsObject.min);
                        output = output.replace(new RegExp("#{max}", "gi"), mystatsObject.max);
                        output = output.replace(new RegExp("#{first}", "gi"), mystatsObject.first);
                        output = output.replace(new RegExp("#{title}", "gi"), stat.title || stat.stat_type + " of " + stat.field);
                        output = output.replace(new RegExp("#{default}", "gi"), GrafanaUtils_1.getFormattedOutput(mystatsObject[stat.stat_type], stat.unit, stat.decimals));
                    }
                    output = output.replace(new RegExp("#{" + stat.stat_type + "," + stat.field + "}", "gi"), GrafanaUtils_1.getFormattedOutput(mystatsObject[stat.stat_type], stat.unit, stat.decimals));
                    output = output.replace(new RegExp("#{" + stat.stat_type + "," + stat.field + ",raw}", "gi"), mystatsObject[stat.defaultStat]);
                    output = output.replace(new RegExp("#{" + stat.stat_type + "," + stat.field + ",title}", "gi"), stat.title);
                });
                var colnames = [];
                lodash_1.default.each(data, function (group) {
                    lodash_1.default.each(group, function (item) {
                        colnames.push(item.colname);
                    });
                });
                colnames = lodash_1.default.uniq(colnames);
                lodash_1.default.each(colnames, function (colname, index) {
                    var mystatsObject = {
                        count: NaN,
                        first: "",
                        max: NaN,
                        mean: NaN,
                        min: NaN,
                        sum: NaN,
                        uniquecount: NaN,
                    };
                    if (data) {
                        var mystats_2 = [];
                        lodash_1.default.each(data, function (group) {
                            var matching_field = lodash_1.default.filter(group, function (g) { return g.colname === colname; });
                            if (matching_field.length > 0) {
                                mystats_2.push(lodash_1.default.first(matching_field).value);
                            }
                        });
                        mystatsObject = BoomUtils_1.getStatsFromArrayOfObjects(mystats_2);
                    }
                    if (index === 0) {
                        output = output.replace(new RegExp("#{title}", "gi"), "" + colname);
                        output = output.replace(new RegExp("#{default}", "gi"), GrafanaUtils_1.getFormattedOutput(mystatsObject.first, "none", "0"));
                    }
                    output = output.replace(new RegExp("#{count," + colname + "}", "gi"), mystatsObject.count);
                    output = output.replace(new RegExp("#{uniquecount," + colname + "}", "gi"), mystatsObject.uniquecount);
                    output = output.replace(new RegExp("#{sum," + colname + "}", "gi"), mystatsObject.sum);
                    output = output.replace(new RegExp("#{mean," + colname + "}", "gi"), mystatsObject.mean);
                    output = output.replace(new RegExp("#{min," + colname + "}", "gi"), mystatsObject.min);
                    output = output.replace(new RegExp("#{max," + colname + "}", "gi"), mystatsObject.max);
                    output = output.replace(new RegExp("#{first," + colname + "}", "gi"), mystatsObject.first);
                    output = output.replace(new RegExp("#{count," + colname + ",raw}", "gi"), mystatsObject.count);
                    output = output.replace(new RegExp("#{uniquecount," + colname + ",raw}", "gi"), mystatsObject.uniquecount);
                    output = output.replace(new RegExp("#{sum," + colname + ",raw}", "gi"), mystatsObject.sum);
                    output = output.replace(new RegExp("#{mean," + colname + ",raw}", "gi"), mystatsObject.mean);
                    output = output.replace(new RegExp("#{min," + colname + ",raw}", "gi"), mystatsObject.min);
                    output = output.replace(new RegExp("#{max," + colname + ",raw}", "gi"), mystatsObject.max);
                    output = output.replace(new RegExp("#{first," + colname + ",raw}", "gi"), mystatsObject.first);
                    output = output.replace(new RegExp("#{count," + colname + ",title}", "gi"), "Count of " + colname);
                    output = output.replace(new RegExp("#{uniquecount," + colname + ",title}", "gi"), "Unique Count of " + colname);
                    output = output.replace(new RegExp("#{sum," + colname + ",title}", "gi"), "Sum of " + colname);
                    output = output.replace(new RegExp("#{mean," + colname + ",title}", "gi"), "Mean of " + colname);
                    output = output.replace(new RegExp("#{min," + colname + ",title}", "gi"), "min of " + colname);
                    output = output.replace(new RegExp("#{max," + colname + ",title}", "gi"), "Max of " + colname);
                    output = output.replace(new RegExp("#{first," + colname + ",title}", "gi"), "First " + colname);
                });
                return output;
            };
            replaceFATokens = function (template) {
                return BoomUtils_2.replaceTokens(template);
            };
            getMatchingCondition = function (data, conditional_formats) {
                var matching_conditions = conditional_formats.filter(function (condition) {
                    var mystatsObject = {
                        count: NaN,
                        first: "",
                        max: NaN,
                        mean: NaN,
                        min: NaN,
                        sum: NaN,
                        uniquecount: NaN,
                    };
                    if (data) {
                        var mystats_3 = [];
                        lodash_1.default.each(data, function (group) {
                            var matching_field = lodash_1.default.filter(group, function (g) { return g.colname === condition.field; });
                            if (matching_field.length > 0) {
                                mystats_3.push(lodash_1.default.first(matching_field).value);
                            }
                        });
                        mystatsObject = BoomUtils_1.getStatsFromArrayOfObjects(mystats_3);
                    }
                    return BoomUtils_1.isMatch(mystatsObject[condition.stat_type], condition.operator, condition.value, condition.value2);
                });
                return matching_conditions && matching_conditions.length > 0 ? lodash_1.default.first(matching_conditions) : null;
            };
            BoomStatsGroup.prototype.getoutput = function (masterdata) {
                if (masterdata.length === 0) {
                    return "<div style='text-align:center;'>No Data</div>";
                }
                else {
                    var filteredData = AppUtils_1.getFilteredDataFromMasterData(masterdata, this.filters);
                    var outTemplate_1 = filteredData.length + " records found";
                    switch (this.templateType) {
                        case "titleonly":
                            outTemplate_1 = "<div style=\"width:100%;float:left;border:1px solid black;\">\n                                    <div style=\"width:100%;float:left;padding:10px;text-align:center;\">#{default}</div>\n                                </div>";
                            break;
                        case "auto":
                            outTemplate_1 = "";
                            lodash_1.default.each(this.stats, function (stat) {
                                outTemplate_1 += "<div style=\"width:100%;float:left;border:1px solid black;\">\n                    <div style=\"width:50%;float:left;padding:10px;\">#{" + stat.stat_type + "," + stat.field + ",title}</div>\n                    <div style=\"width:50%;float:left;padding:10px;\">#{" + stat.stat_type + "," + stat.field + "}</div>\n                </div>";
                            });
                            break;
                        case "custom":
                            outTemplate_1 = this.customTemplate;
                            break;
                        case "jumbo":
                            outTemplate_1 = "<div style=\"width:100%;float:left;text-align:center;border:1px solid black;\">\n                                    <br/>\n                                    <h5>#{title}</h5>\n                                    <br/>\n                                    <h1>#{default}</h1>\n                                    <br/>\n                                </div>";
                            break;
                        case "jumbo_without_title":
                            outTemplate_1 = "<div style=\"width:100%;float:left;text-align:center;border:1px solid black;\">\n                                    <br/>\n                                    <h1>#{default}</h1>\n                                    <br/>\n                                </div>";
                            break;
                        default:
                            outTemplate_1 = this.customTemplate;
                            break;
                    }
                    var matching_condition = getMatchingCondition(filteredData, this.conditional_formats);
                    var bgColor = matching_condition && matching_condition.bgColor ? matching_condition.bgColor : this.bgColor;
                    var textColor = matching_condition && matching_condition.textColor ? matching_condition.textColor : this.textColor;
                    var custom_css_class = matching_condition && matching_condition.custom_css_class ? matching_condition.custom_css_class : "not_applicable";
                    if (custom_css_class !== "not_applicable") {
                        bgColor = "not_applicable";
                        textColor = "not_applicable";
                    }
                    var output_with_statsReplaced = replaceStatsFromTemplate(outTemplate_1, this.stats, filteredData);
                    var output_with_tokensreplaced = replaceFATokens(output_with_statsReplaced);
                    return "<div style=\"width:" + (this.statWidth || "100") + "%;float:left;background:" + bgColor + ";color:" + textColor + ";\" class=\"" + custom_css_class + "\">\n                    " + output_with_tokensreplaced + "\n                </div>";
                }
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVN0YXRzR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwL0Jvb21TdGF0c0dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU9BLDZCQUFXLGVBQWUsR0FBRyxVQUFVLElBQUk7Z0JBQ3ZDLElBQUksVUFBVSxHQUFvQixFQUFFLENBQUM7Z0JBQ3JDLGdCQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFBLENBQUM7b0JBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTt3QkFDcEIsSUFBSSxPQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3QkFDcEIsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxDQUFDOzRCQUNsQixJQUFJLEtBQUssR0FBa0IsRUFBRSxDQUFDOzRCQUM5QixnQkFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsQ0FBQztnQ0FDZixJQUFJLE1BQU0sR0FBZ0I7b0NBQ3RCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7b0NBQzFCLEtBQUssU0FBQTtvQ0FDTCxLQUFLLEVBQUUsQ0FBQyxDQUFDO29DQUNULEtBQUssRUFBRSxHQUFHO2lDQUNiLENBQUM7Z0NBQ0YsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDdkIsQ0FBQyxDQUFDLENBQUM7NEJBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDM0IsQ0FBQyxDQUFDLENBQUM7cUJBQ047eUJBQU07d0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO3FCQUNwRTtnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLFVBQVUsQ0FBQztZ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Q0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO29CQUMxSSxJQUFJLGdCQUFnQixLQUFLLGdCQUFnQixFQUFFO3dCQUN2QyxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7d0JBQzNCLFNBQVMsR0FBRSxnQkFBZ0IsQ0FBQztxQkFDL0I7b0JBQ0QsSUFBSSx5QkFBeUIsR0FBRyx3QkFBd0IsQ0FBQyxhQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDaEcsSUFBSSwwQkFBMEIsR0FBRyxlQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQztvQkFDNUUsT0FBTyx5QkFBcUIsSUFBSSxDQUFDLFNBQVMsSUFBSSxLQUFLLGlDQUEyQixPQUFPLGVBQVUsU0FBUyxvQkFBYSxnQkFBZ0IsaUNBQ3ZILDBCQUEwQiw2QkFDekIsQ0FBQztpQkFDbkI7WUFDTCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XHJcbmltcG9ydCB7IElNYXN0ZXJEYXRhLCBJQm9vbUZpbHRlciwgSUJvb21TdW1tYXJ5Q29uZGl0aW9uYWxGb3JtYXRzLCBJQm9vbVN0YXRzR3JvdXAgfSBmcm9tIFwiLi8uLi9kZWZpbml0aW9ucy90eXBlc1wiO1xyXG5pbXBvcnQgeyBnZXRGaWx0ZXJlZERhdGFGcm9tTWFzdGVyRGF0YSB9IGZyb20gXCIuLy4uL3V0aWxzL0FwcFV0aWxzXCI7XHJcbmltcG9ydCB7IGdldFN0YXRzRnJvbUFycmF5T2ZPYmplY3RzLCBpc01hdGNoIH0gZnJvbSBcIi4vLi4vdXRpbHMvQm9vbVV0aWxzXCI7XHJcbmltcG9ydCB7IGdldEZvcm1hdHRlZE91dHB1dCB9IGZyb20gXCIuLy4uL3V0aWxzL0dyYWZhbmFVdGlsc1wiO1xyXG5pbXBvcnQgeyByZXBsYWNlVG9rZW5zIH0gZnJvbSBcIi4uL3V0aWxzL0Jvb21VdGlsc1wiO1xyXG5cclxuZXhwb3J0IGxldCBidWlsZE1hc3RlckRhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgbGV0IG1hc3RlcmRhdGE6IElNYXN0ZXJEYXRhW11bXSA9IFtdO1xyXG4gICAgXy5lYWNoKGRhdGEsIGQgPT4ge1xyXG4gICAgICAgIGlmIChkLnR5cGUgPT09IFwidGFibGVcIikge1xyXG4gICAgICAgICAgICBsZXQgcmVmSWQgPSBkLnJlZklkO1xyXG4gICAgICAgICAgICBfLmVhY2goZC5yb3dzLCAocm93LCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXA6IElNYXN0ZXJEYXRhW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChyb3csIChjb2wsIGopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbXlkYXRhOiBJTWFzdGVyRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbmFtZTogZC5jb2x1bW5zW2pdLnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3dpZDogK2ksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb2xcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLnB1c2gobXlkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbWFzdGVyZGF0YS5wdXNoKGdyb3VwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVSUk9SOiBPbmx5IHRhYmxlIGZvcm1hdCBpcyBjdXJyZW50bHkgc3VwcG9ydGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG1hc3RlcmRhdGE7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vbUZpbHRlciBpbXBsZW1lbnRzIElCb29tRmlsdGVyIHtcclxuICAgIHB1YmxpYyBmaWVsZDogc3RyaW5nO1xyXG4gICAgcHVibGljIG9wZXJhdG9yOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICAgIHB1YmxpYyB2YWx1ZTI6IHN0cmluZztcclxuICAgIHB1YmxpYyBDYW5TaG93VmFsdWUyO1xyXG4gICAgcHVibGljIEdldFZhbHVlMkhlbHBlcjtcclxuICAgIHB1YmxpYyBHZXRWYWx1ZTFIZWxwZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG9wdGlvbnMuZmllbGQgfHwgXCJTYW1wbGVcIjtcclxuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvciB8fCBcImVxdWFsc1wiO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBvcHRpb25zLnZhbHVlIHx8IFwiU29tZXRoaW5nXCI7XHJcbiAgICAgICAgdGhpcy52YWx1ZTIgPSBvcHRpb25zLnZhbHVlMiB8fCBcIlwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFNlY29uZGFyeUZpZWxkRGV0YWlscyA9IGZ1bmN0aW9uIChvcGVyYXRvcikge1xyXG4gICAgICAgIGxldCBDYW5TaG93VmFsdWUyID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IFZhbHVlMUhlbHBlciA9IFwiVmFsdWVcIjtcclxuICAgICAgICBsZXQgVmFsdWUySGVscGVyID0gXCJcIjtcclxuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yLnJlcGxhY2UoXCJpZ25vcmVjYXNlXCIsIFwiXCIpLnRyaW0oKSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiYmV0d2VlblwiOlxyXG4gICAgICAgICAgICAgICAgQ2FuU2hvd1ZhbHVlMiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBWYWx1ZTFIZWxwZXIgPSBcIkZyb21cIjtcclxuICAgICAgICAgICAgICAgIFZhbHVlMkhlbHBlciA9IFwiVG9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5zaWRlcmFuZ2VcIjpcclxuICAgICAgICAgICAgICAgIENhblNob3dWYWx1ZTIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVmFsdWUxSGVscGVyID0gXCJGcm9tXCI7XHJcbiAgICAgICAgICAgICAgICBWYWx1ZTJIZWxwZXIgPSBcIlRvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm91dHNpZGVyYW5nZVwiOlxyXG4gICAgICAgICAgICAgICAgQ2FuU2hvd1ZhbHVlMiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBWYWx1ZTFIZWxwZXIgPSBcIkZyb21cIjtcclxuICAgICAgICAgICAgICAgIFZhbHVlMkhlbHBlciA9IFwiVG9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW5cIjpcclxuICAgICAgICAgICAgICAgIENhblNob3dWYWx1ZTIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVmFsdWUxSGVscGVyID0gXCJWYWx1ZXNcIjtcclxuICAgICAgICAgICAgICAgIFZhbHVlMkhlbHBlciA9IFwiU2VwZXJhdG9yXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBDYW5TaG93VmFsdWUyLFxyXG4gICAgICAgICAgICBWYWx1ZTFIZWxwZXIsXHJcbiAgICAgICAgICAgIFZhbHVlMkhlbHBlclxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxufVxyXG5cclxuQm9vbUZpbHRlci5wcm90b3R5cGUuR2V0VmFsdWUxSGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0U2Vjb25kYXJ5RmllbGREZXRhaWxzKHRoaXMub3BlcmF0b3IpLlZhbHVlMUhlbHBlcjtcclxufTtcclxuQm9vbUZpbHRlci5wcm90b3R5cGUuR2V0VmFsdWUySGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0U2Vjb25kYXJ5RmllbGREZXRhaWxzKHRoaXMub3BlcmF0b3IpLlZhbHVlMkhlbHBlcjtcclxufTtcclxuQm9vbUZpbHRlci5wcm90b3R5cGUuQ2FuU2hvd1ZhbHVlMiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFNlY29uZGFyeUZpZWxkRGV0YWlscyh0aGlzLm9wZXJhdG9yKS5DYW5TaG93VmFsdWUyO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvb21TdW1tYXJ5RmlsdGVyIGV4dGVuZHMgQm9vbUZpbHRlciBpbXBsZW1lbnRzIElCb29tRmlsdGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJvb21TdW1tYXJ5Q29uZGl0aW9uYWxGb3JtYXRzIGV4dGVuZHMgQm9vbUZpbHRlciBpbXBsZW1lbnRzIElCb29tRmlsdGVyLCBJQm9vbVN1bW1hcnlDb25kaXRpb25hbEZvcm1hdHMge1xyXG4gICAgcHVibGljIHN0YXRfdHlwZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGJnQ29sb3I6IHN0cmluZztcclxuICAgIHB1YmxpYyB0ZXh0Q29sb3I6IHN0cmluZztcclxuICAgIHB1YmxpYyBjdXN0b21fY3NzX2NsYXNzOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5jdXN0b21fY3NzX2NsYXNzID0gb3B0aW9ucy5jdXN0b21fY3NzX2NsYXNzIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5zdGF0X3R5cGUgPSBvcHRpb25zLnN0YXRfdHlwZSB8fCBcImZpcnN0XCI7XHJcbiAgICAgICAgdGhpcy5iZ0NvbG9yID0gb3B0aW9ucy5iZ0NvbG9yIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy50ZXh0Q29sb3IgPSBvcHRpb25zLnRleHRDb2xvciB8fCBcIlwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vbVN0YXQge1xyXG4gICAgcHVibGljIGZpZWxkO1xyXG4gICAgcHVibGljIHN0YXRfdHlwZTtcclxuICAgIHB1YmxpYyBmb3JtYXRfYXM7XHJcbiAgICBwdWJsaWMgZGVjaW1hbHM7XHJcbiAgICBwdWJsaWMgdW5pdDtcclxuICAgIHB1YmxpYyBzZXRVbml0Rm9ybWF0O1xyXG4gICAgcHVibGljIHRpdGxlO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBvcHRpb25zLmZpZWxkIHx8IFwiU2FtcGxlXCI7XHJcbiAgICAgICAgdGhpcy5zdGF0X3R5cGUgPSBvcHRpb25zLnN0YXRfdHlwZSB8fCBcImZpcnN0XCI7XHJcbiAgICAgICAgdGhpcy5mb3JtYXRfYXMgPSBvcHRpb25zLmZvcm1hdF9hcyB8fCBcInN0cmluZ1wiO1xyXG4gICAgICAgIHRoaXMuZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzIHx8IFwiMFwiO1xyXG4gICAgICAgIHRoaXMudW5pdCA9IG9wdGlvbnMudW5pdCB8fCBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLnRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCB0aGlzLnN0YXRfdHlwZSArIFwiIG9mIFwiICsgdGhpcy5maWVsZCB8fCBcIkRldGFpbFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5Cb29tU3RhdC5wcm90b3R5cGUuc2V0VW5pdEZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy51bml0ID0gZm9ybWF0ICYmIGZvcm1hdC52YWx1ZSA/IGZvcm1hdC52YWx1ZSA6IFwibm9uZVwiO1xyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvb21TdGF0c0dyb3VwIHtcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHN0YXRzOiBCb29tU3RhdFtdO1xyXG4gICAgcHVibGljIHN0YXRXaWR0aDogU3RyaW5nO1xyXG4gICAgcHVibGljIGJnQ29sb3I6IHN0cmluZztcclxuICAgIHB1YmxpYyB0ZXh0Q29sb3I6IHN0cmluZztcclxuICAgIHB1YmxpYyB0ZW1wbGF0ZVR5cGU6IHN0cmluZztcclxuICAgIHB1YmxpYyBjdXN0b21UZW1wbGF0ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGZpbHRlcnM6IEJvb21TdW1tYXJ5RmlsdGVyW107XHJcbiAgICBwdWJsaWMgY29uZGl0aW9uYWxfZm9ybWF0czogQm9vbVN1bW1hcnlDb25kaXRpb25hbEZvcm1hdHNbXTtcclxuICAgIHB1YmxpYyBhZGRTdGF0O1xyXG4gICAgcHVibGljIHJlbW92ZVN0YXQ7XHJcbiAgICBwdWJsaWMgYWRkRmlsdGVyO1xyXG4gICAgcHVibGljIHJlbW92ZUZpbHRlcjtcclxuICAgIHB1YmxpYyBhZGRDb25kaXRvbmFsRm9ybWF0O1xyXG4gICAgcHVibGljIHJlbW92ZUNvbmRpdGlvbmFsRm9ybWF0O1xyXG4gICAgcHVibGljIG1vdmVDb25kaXRpb25hbEZvcm1hdDtcclxuICAgIHB1YmxpYyBnZXRvdXRwdXQ7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IG9wdGlvbnMudGl0bGUgfHwgXCJcIjtcclxuICAgICAgICB0aGlzLnN0YXRzID0gb3B0aW9ucy5zdGF0cyB8fCBbXTtcclxuICAgICAgICB0aGlzLnN0YXRXaWR0aCA9IG9wdGlvbnMuc3RhdFdpZHRoIHx8IFwiMTAwXCI7XHJcbiAgICAgICAgdGhpcy5iZ0NvbG9yID0gb3B0aW9ucy5iZ0NvbG9yIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy50ZXh0Q29sb3IgPSBvcHRpb25zLnRleHRDb2xvciB8fCBcIlwiO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVUeXBlID0gb3B0aW9ucy50ZW1wbGF0ZVR5cGUgfHwgXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgdGhpcy5jdXN0b21UZW1wbGF0ZSA9IG9wdGlvbnMuY3VzdG9tVGVtcGxhdGUgfHwgYDxkaXYgc3R5bGU9XCJ3aWR0aDoxMDAlO2Zsb2F0OmxlZnQ7Ym9yZGVyOjFweCBzb2xpZCBibGFjaztcIj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOjUwJTtmbG9hdDpsZWZ0O3BhZGRpbmc6MTBweDtcIj5Ub3RhbCBSZWNvcmRzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDo1MCU7ZmxvYXQ6bGVmdDtwYWRkaW5nOjEwcHg7XCI+I3tjb3VudH08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycyB8fCBbXTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHMgPSBvcHRpb25zLmNvbmRpdGlvbmFsX2Zvcm1hdHMgfHwgW107XHJcbiAgICB9XHJcbn1cclxuXHJcbkJvb21TdGF0c0dyb3VwLnByb3RvdHlwZS5hZGRTdGF0ID0gZnVuY3Rpb24gKCk6IHZvaWQge1xyXG4gICAgbGV0IG5ld01ldHJpYyA9IG5ldyBCb29tU3RhdCh7fSk7XHJcbiAgICB0aGlzLnN0YXRzID0gdGhpcy5zdGF0cyB8fCBbXTtcclxuICAgIHRoaXMuc3RhdHMucHVzaChuZXdNZXRyaWMpO1xyXG59O1xyXG5cclxuQm9vbVN0YXRzR3JvdXAucHJvdG90eXBlLnJlbW92ZVN0YXQgPSBmdW5jdGlvbiAoaW5kZXg6IE51bWJlcik6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc3RhdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuc3RhdHMuc3BsaWNlKE51bWJlcihpbmRleCksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQm9vbVN0YXRzR3JvdXAucHJvdG90eXBlLmFkZEZpbHRlciA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcclxuICAgIGxldCBuZXdmaWx0ZXIgPSBuZXcgQm9vbVN1bW1hcnlGaWx0ZXIoe1xyXG4gICAgICAgIGZpZWxkOiBcIlNhbXBsZVwiLFxyXG4gICAgICAgIG9wZXJhdG9yOiBcImVxdWFsc1wiXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZmlsdGVycyA9IHRoaXMuZmlsdGVycyB8fCBbXTtcclxuICAgIHRoaXMuZmlsdGVycy5wdXNoKG5ld2ZpbHRlcik7XHJcbn07XHJcblxyXG5Cb29tU3RhdHNHcm91cC5wcm90b3R5cGUucmVtb3ZlRmlsdGVyID0gZnVuY3Rpb24gKGluZGV4OiBOdW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmZpbHRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuZmlsdGVycy5zcGxpY2UoTnVtYmVyKGluZGV4KSwgMSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Cb29tU3RhdHNHcm91cC5wcm90b3R5cGUuYWRkQ29uZGl0b25hbEZvcm1hdCA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcclxuICAgIGxldCBuZXdfY29uZGl0aW9uYWxfZm9ybWF0dGVyID0gbmV3IEJvb21TdW1tYXJ5Q29uZGl0aW9uYWxGb3JtYXRzKHtcclxuICAgICAgICBvcGVyYXRvcjogXCJlcXVhbHNcIixcclxuICAgICAgICBzdGF0X3R5cGU6IFwiZmlyc3RcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHMgPSB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHMgfHwgW107XHJcbiAgICB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHMucHVzaChuZXdfY29uZGl0aW9uYWxfZm9ybWF0dGVyKTtcclxufTtcclxuXHJcbkJvb21TdGF0c0dyb3VwLnByb3RvdHlwZS5yZW1vdmVDb25kaXRpb25hbEZvcm1hdCA9IGZ1bmN0aW9uIChpbmRleDogTnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb25kaXRpb25hbF9mb3JtYXRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHMuc3BsaWNlKE51bWJlcihpbmRleCksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQm9vbVN0YXRzR3JvdXAucHJvdG90eXBlLm1vdmVDb25kaXRpb25hbEZvcm1hdCA9IGZ1bmN0aW9uIChkaXJlY3Rpb246IHN0cmluZywgaW5kZXg6IE51bWJlcik6IHZvaWQge1xyXG4gICAgbGV0IHRlbXBFbGVtZW50ID0gdGhpcy5jb25kaXRpb25hbF9mb3JtYXRzW051bWJlcihpbmRleCldO1xyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJVUFwiKSB7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25hbF9mb3JtYXRzW051bWJlcihpbmRleCldID0gdGhpcy5jb25kaXRpb25hbF9mb3JtYXRzW1xyXG4gICAgICAgICAgICBOdW1iZXIoaW5kZXgpIC0gMVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25hbF9mb3JtYXRzW051bWJlcihpbmRleCkgLSAxXSA9IHRlbXBFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJET1dOXCIpIHtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHNbTnVtYmVyKGluZGV4KV0gPSB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHNbXHJcbiAgICAgICAgICAgIE51bWJlcihpbmRleCkgKyAxXHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbmFsX2Zvcm1hdHNbTnVtYmVyKGluZGV4KSArIDFdID0gdGVtcEVsZW1lbnQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG5sZXQgcmVwbGFjZVN0YXRzRnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBzdGF0cywgZGF0YSk6IHN0cmluZyB7XHJcbiAgICBsZXQgb3V0cHV0ID0gdGVtcGxhdGU7XHJcbiAgICBfLmVhY2goc3RhdHMsIChzdGF0LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBteXN0YXRzT2JqZWN0OiBJQm9vbVN0YXRzR3JvdXAgPSB7XHJcbiAgICAgICAgICAgIGNvdW50OiBOYU4sXHJcbiAgICAgICAgICAgIGZpcnN0OiBcIlwiLFxyXG4gICAgICAgICAgICBtYXg6IE5hTixcclxuICAgICAgICAgICAgbWVhbjogTmFOLFxyXG4gICAgICAgICAgICBtaW46IE5hTixcclxuICAgICAgICAgICAgc3VtOiBOYU4sXHJcbiAgICAgICAgICAgIHVuaXF1ZWNvdW50OiBOYU4sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgbXlzdGF0czogYW55ID0gW107XHJcbiAgICAgICAgICAgIF8uZWFjaChkYXRhLCBncm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hpbmdfZmllbGQgPSBfLmZpbHRlcihncm91cCwgZyA9PiBnLmNvbG5hbWUgPT09IHN0YXQuZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nX2ZpZWxkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBteXN0YXRzLnB1c2goXy5maXJzdChtYXRjaGluZ19maWVsZCkudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbXlzdGF0c09iamVjdCA9IGdldFN0YXRzRnJvbUFycmF5T2ZPYmplY3RzKG15c3RhdHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7Y291bnR9XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3QuY291bnQpO1xyXG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3t1bmlxdWVjb3VudH1cIiwgXCJnaVwiKSwgbXlzdGF0c09iamVjdC51bmlxdWVjb3VudCk7XHJcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje3N1bX1cIiwgXCJnaVwiKSwgbXlzdGF0c09iamVjdC5zdW0pO1xyXG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3ttZWFufVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0Lm1lYW4pO1xyXG4gICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3ttaW59XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3QubWluKTtcclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7bWF4fVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0Lm1heCk7XHJcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje2ZpcnN0fVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0LmZpcnN0KTtcclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7dGl0bGV9XCIsIFwiZ2lcIiksIHN0YXQudGl0bGUgfHwgYCR7c3RhdC5zdGF0X3R5cGV9IG9mICR7c3RhdC5maWVsZH1gKTtcclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7ZGVmYXVsdH1cIiwgXCJnaVwiKSwgZ2V0Rm9ybWF0dGVkT3V0cHV0KG15c3RhdHNPYmplY3Rbc3RhdC5zdGF0X3R5cGVdLCBzdGF0LnVuaXQsIHN0YXQuZGVjaW1hbHMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7XCIgKyBzdGF0LnN0YXRfdHlwZSArIFwiLFwiICsgc3RhdC5maWVsZCArIFwifVwiLCBcImdpXCIpLCBnZXRGb3JtYXR0ZWRPdXRwdXQobXlzdGF0c09iamVjdFtzdGF0LnN0YXRfdHlwZV0sIHN0YXQudW5pdCwgc3RhdC5kZWNpbWFscykpO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje1wiICsgc3RhdC5zdGF0X3R5cGUgKyBcIixcIiArIHN0YXQuZmllbGQgKyBcIixyYXd9XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3Rbc3RhdC5kZWZhdWx0U3RhdF0pO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje1wiICsgc3RhdC5zdGF0X3R5cGUgKyBcIixcIiArIHN0YXQuZmllbGQgKyBcIix0aXRsZX1cIiwgXCJnaVwiKSwgc3RhdC50aXRsZSk7XHJcbiAgICB9KTtcclxuICAgIGxldCBjb2xuYW1lczogYW55W10gPSBbXTtcclxuICAgIF8uZWFjaChkYXRhLCBncm91cCA9PiB7XHJcbiAgICAgICAgXy5lYWNoKGdyb3VwLCBpdGVtID0+IHtcclxuICAgICAgICAgICAgY29sbmFtZXMucHVzaChpdGVtLmNvbG5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBjb2xuYW1lcyA9IF8udW5pcShjb2xuYW1lcyk7XHJcbiAgICBfLmVhY2goY29sbmFtZXMsIChjb2xuYW1lLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBteXN0YXRzT2JqZWN0OiBJQm9vbVN0YXRzR3JvdXAgPSB7XHJcbiAgICAgICAgICAgIGNvdW50OiBOYU4sXHJcbiAgICAgICAgICAgIGZpcnN0OiBcIlwiLFxyXG4gICAgICAgICAgICBtYXg6IE5hTixcclxuICAgICAgICAgICAgbWVhbjogTmFOLFxyXG4gICAgICAgICAgICBtaW46IE5hTixcclxuICAgICAgICAgICAgc3VtOiBOYU4sXHJcbiAgICAgICAgICAgIHVuaXF1ZWNvdW50OiBOYU4sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgbXlzdGF0czogYW55ID0gW107XHJcbiAgICAgICAgICAgIF8uZWFjaChkYXRhLCBncm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hpbmdfZmllbGQgPSBfLmZpbHRlcihncm91cCwgZyA9PiBnLmNvbG5hbWUgPT09IGNvbG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nX2ZpZWxkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBteXN0YXRzLnB1c2goXy5maXJzdChtYXRjaGluZ19maWVsZCkudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbXlzdGF0c09iamVjdCA9IGdldFN0YXRzRnJvbUFycmF5T2ZPYmplY3RzKG15c3RhdHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7dGl0bGV9XCIsIFwiZ2lcIiksIGAke2NvbG5hbWV9YCk7XHJcbiAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje2RlZmF1bHR9XCIsIFwiZ2lcIiksIGdldEZvcm1hdHRlZE91dHB1dChteXN0YXRzT2JqZWN0LmZpcnN0LCBcIm5vbmVcIiwgXCIwXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7Y291bnQsXCIgKyBjb2xuYW1lICsgXCJ9XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3QuY291bnQpO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje3VuaXF1ZWNvdW50LFwiICsgY29sbmFtZSArIFwifVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0LnVuaXF1ZWNvdW50KTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3tzdW0sXCIgKyBjb2xuYW1lICsgXCJ9XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3Quc3VtKTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3ttZWFuLFwiICsgY29sbmFtZSArIFwifVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0Lm1lYW4pO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje21pbixcIiArIGNvbG5hbWUgKyBcIn1cIiwgXCJnaVwiKSwgbXlzdGF0c09iamVjdC5taW4pO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje21heCxcIiArIGNvbG5hbWUgKyBcIn1cIiwgXCJnaVwiKSwgbXlzdGF0c09iamVjdC5tYXgpO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje2ZpcnN0LFwiICsgY29sbmFtZSArIFwifVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0LmZpcnN0KTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3tjb3VudCxcIiArIGNvbG5hbWUgKyBcIixyYXd9XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3QuY291bnQpO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje3VuaXF1ZWNvdW50LFwiICsgY29sbmFtZSArIFwiLHJhd31cIiwgXCJnaVwiKSwgbXlzdGF0c09iamVjdC51bmlxdWVjb3VudCk7XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7c3VtLFwiICsgY29sbmFtZSArIFwiLHJhd31cIiwgXCJnaVwiKSwgbXlzdGF0c09iamVjdC5zdW0pO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje21lYW4sXCIgKyBjb2xuYW1lICsgXCIscmF3fVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0Lm1lYW4pO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje21pbixcIiArIGNvbG5hbWUgKyBcIixyYXd9XCIsIFwiZ2lcIiksIG15c3RhdHNPYmplY3QubWluKTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3ttYXgsXCIgKyBjb2xuYW1lICsgXCIscmF3fVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0Lm1heCk7XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7Zmlyc3QsXCIgKyBjb2xuYW1lICsgXCIscmF3fVwiLCBcImdpXCIpLCBteXN0YXRzT2JqZWN0LmZpcnN0KTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3tjb3VudCxcIiArIGNvbG5hbWUgKyBcIix0aXRsZX1cIiwgXCJnaVwiKSwgYENvdW50IG9mICR7Y29sbmFtZX1gKTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3t1bmlxdWVjb3VudCxcIiArIGNvbG5hbWUgKyBcIix0aXRsZX1cIiwgXCJnaVwiKSwgYFVuaXF1ZSBDb3VudCBvZiAke2NvbG5hbWV9YCk7XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7c3VtLFwiICsgY29sbmFtZSArIFwiLHRpdGxlfVwiLCBcImdpXCIpLCBgU3VtIG9mICR7Y29sbmFtZX1gKTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3ttZWFuLFwiICsgY29sbmFtZSArIFwiLHRpdGxlfVwiLCBcImdpXCIpLCBgTWVhbiBvZiAke2NvbG5hbWV9YCk7XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UobmV3IFJlZ0V4cChcIiN7bWluLFwiICsgY29sbmFtZSArIFwiLHRpdGxlfVwiLCBcImdpXCIpLCBgbWluIG9mICR7Y29sbmFtZX1gKTtcclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShuZXcgUmVnRXhwKFwiI3ttYXgsXCIgKyBjb2xuYW1lICsgXCIsdGl0bGV9XCIsIFwiZ2lcIiksIGBNYXggb2YgJHtjb2xuYW1lfWApO1xyXG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIje2ZpcnN0LFwiICsgY29sbmFtZSArIFwiLHRpdGxlfVwiLCBcImdpXCIpLCBgRmlyc3QgJHtjb2xuYW1lfWApO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59O1xyXG5cclxubGV0IHJlcGxhY2VGQVRva2VucyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gcmVwbGFjZVRva2Vucyh0ZW1wbGF0ZSk7XHJcbn07XHJcblxyXG5sZXQgZ2V0TWF0Y2hpbmdDb25kaXRpb24gPSBmdW5jdGlvbiAoZGF0YSwgY29uZGl0aW9uYWxfZm9ybWF0cykge1xyXG4gICAgbGV0IG1hdGNoaW5nX2NvbmRpdGlvbnMgPSBjb25kaXRpb25hbF9mb3JtYXRzLmZpbHRlcihjb25kaXRpb24gPT4ge1xyXG4gICAgICAgIGxldCBteXN0YXRzT2JqZWN0OiBJQm9vbVN0YXRzR3JvdXAgPSB7XHJcbiAgICAgICAgICAgIGNvdW50OiBOYU4sXHJcbiAgICAgICAgICAgIGZpcnN0OiBcIlwiLFxyXG4gICAgICAgICAgICBtYXg6IE5hTixcclxuICAgICAgICAgICAgbWVhbjogTmFOLFxyXG4gICAgICAgICAgICBtaW46IE5hTixcclxuICAgICAgICAgICAgc3VtOiBOYU4sXHJcbiAgICAgICAgICAgIHVuaXF1ZWNvdW50OiBOYU4sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgbXlzdGF0czogYW55ID0gW107XHJcbiAgICAgICAgICAgIF8uZWFjaChkYXRhLCBncm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hpbmdfZmllbGQgPSBfLmZpbHRlcihncm91cCwgZyA9PiBnLmNvbG5hbWUgPT09IGNvbmRpdGlvbi5maWVsZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmdfZmllbGQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG15c3RhdHMucHVzaChfLmZpcnN0KG1hdGNoaW5nX2ZpZWxkKS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBteXN0YXRzT2JqZWN0ID0gZ2V0U3RhdHNGcm9tQXJyYXlPZk9iamVjdHMobXlzdGF0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc01hdGNoKG15c3RhdHNPYmplY3RbY29uZGl0aW9uLnN0YXRfdHlwZV0sIGNvbmRpdGlvbi5vcGVyYXRvciwgY29uZGl0aW9uLnZhbHVlLCBjb25kaXRpb24udmFsdWUyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG1hdGNoaW5nX2NvbmRpdGlvbnMgJiYgbWF0Y2hpbmdfY29uZGl0aW9ucy5sZW5ndGggPiAwID8gXy5maXJzdChtYXRjaGluZ19jb25kaXRpb25zKSA6IG51bGw7XHJcbn07XHJcblxyXG5Cb29tU3RhdHNHcm91cC5wcm90b3R5cGUuZ2V0b3V0cHV0ID0gZnVuY3Rpb24gKG1hc3RlcmRhdGEpOiBzdHJpbmcge1xyXG4gICAgaWYgKG1hc3RlcmRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXI7Jz5ObyBEYXRhPC9kaXY+XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSBnZXRGaWx0ZXJlZERhdGFGcm9tTWFzdGVyRGF0YShtYXN0ZXJkYXRhLCB0aGlzLmZpbHRlcnMpO1xyXG4gICAgICAgIGxldCBvdXRUZW1wbGF0ZSA9IGZpbHRlcmVkRGF0YS5sZW5ndGggKyBcIiByZWNvcmRzIGZvdW5kXCI7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnRlbXBsYXRlVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwidGl0bGVvbmx5XCI6XHJcbiAgICAgICAgICAgICAgICBvdXRUZW1wbGF0ZSA9IGA8ZGl2IHN0eWxlPVwid2lkdGg6MTAwJTtmbG9hdDpsZWZ0O2JvcmRlcjoxcHggc29saWQgYmxhY2s7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoxMDAlO2Zsb2F0OmxlZnQ7cGFkZGluZzoxMHB4O3RleHQtYWxpZ246Y2VudGVyO1wiPiN7ZGVmYXVsdH08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJhdXRvXCI6XHJcbiAgICAgICAgICAgICAgICBvdXRUZW1wbGF0ZSA9IGBgO1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuc3RhdHMsIHN0YXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dFRlbXBsYXRlICs9IGA8ZGl2IHN0eWxlPVwid2lkdGg6MTAwJTtmbG9hdDpsZWZ0O2JvcmRlcjoxcHggc29saWQgYmxhY2s7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOjUwJTtmbG9hdDpsZWZ0O3BhZGRpbmc6MTBweDtcIj4jeyR7c3RhdC5zdGF0X3R5cGV9LCR7c3RhdC5maWVsZH0sdGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOjUwJTtmbG9hdDpsZWZ0O3BhZGRpbmc6MTBweDtcIj4jeyR7c3RhdC5zdGF0X3R5cGV9LCR7c3RhdC5maWVsZH19PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImN1c3RvbVwiOlxyXG4gICAgICAgICAgICAgICAgb3V0VGVtcGxhdGUgPSB0aGlzLmN1c3RvbVRlbXBsYXRlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJqdW1ib1wiOlxyXG4gICAgICAgICAgICAgICAgb3V0VGVtcGxhdGUgPSBgPGRpdiBzdHlsZT1cIndpZHRoOjEwMCU7ZmxvYXQ6bGVmdDt0ZXh0LWFsaWduOmNlbnRlcjtib3JkZXI6MXB4IHNvbGlkIGJsYWNrO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDU+XFwje3RpdGxlfTwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT5cXCN7ZGVmYXVsdH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImp1bWJvX3dpdGhvdXRfdGl0bGVcIjpcclxuICAgICAgICAgICAgICAgIG91dFRlbXBsYXRlID0gYDxkaXYgc3R5bGU9XCJ3aWR0aDoxMDAlO2Zsb2F0OmxlZnQ7dGV4dC1hbGlnbjpjZW50ZXI7Ym9yZGVyOjFweCBzb2xpZCBibGFjaztcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPlxcI3tkZWZhdWx0fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgb3V0VGVtcGxhdGUgPSB0aGlzLmN1c3RvbVRlbXBsYXRlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBtYXRjaGluZ19jb25kaXRpb24gPSBnZXRNYXRjaGluZ0NvbmRpdGlvbihmaWx0ZXJlZERhdGEsIHRoaXMuY29uZGl0aW9uYWxfZm9ybWF0cyk7XHJcbiAgICAgICAgbGV0IGJnQ29sb3IgPSBtYXRjaGluZ19jb25kaXRpb24gJiYgbWF0Y2hpbmdfY29uZGl0aW9uLmJnQ29sb3IgPyBtYXRjaGluZ19jb25kaXRpb24uYmdDb2xvciA6IHRoaXMuYmdDb2xvcjtcclxuICAgICAgICBsZXQgdGV4dENvbG9yID0gbWF0Y2hpbmdfY29uZGl0aW9uICYmIG1hdGNoaW5nX2NvbmRpdGlvbi50ZXh0Q29sb3IgPyBtYXRjaGluZ19jb25kaXRpb24udGV4dENvbG9yIDogdGhpcy50ZXh0Q29sb3I7XHJcbiAgICAgICAgbGV0IGN1c3RvbV9jc3NfY2xhc3MgPSBtYXRjaGluZ19jb25kaXRpb24gJiYgbWF0Y2hpbmdfY29uZGl0aW9uLmN1c3RvbV9jc3NfY2xhc3MgPyBtYXRjaGluZ19jb25kaXRpb24uY3VzdG9tX2Nzc19jbGFzcyA6IFwibm90X2FwcGxpY2FibGVcIjtcclxuICAgICAgICBpZiAoY3VzdG9tX2Nzc19jbGFzcyAhPT0gXCJub3RfYXBwbGljYWJsZVwiKSB7XHJcbiAgICAgICAgICAgIGJnQ29sb3IgPSBcIm5vdF9hcHBsaWNhYmxlXCI7XHJcbiAgICAgICAgICAgIHRleHRDb2xvcj0gXCJub3RfYXBwbGljYWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3V0cHV0X3dpdGhfc3RhdHNSZXBsYWNlZCA9IHJlcGxhY2VTdGF0c0Zyb21UZW1wbGF0ZShvdXRUZW1wbGF0ZSwgdGhpcy5zdGF0cywgZmlsdGVyZWREYXRhKTtcclxuICAgICAgICBsZXQgb3V0cHV0X3dpdGhfdG9rZW5zcmVwbGFjZWQgPSByZXBsYWNlRkFUb2tlbnMob3V0cHV0X3dpdGhfc3RhdHNSZXBsYWNlZCk7XHJcbiAgICAgICAgcmV0dXJuIGA8ZGl2IHN0eWxlPVwid2lkdGg6JHt0aGlzLnN0YXRXaWR0aCB8fCBcIjEwMFwifSU7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kOiR7YmdDb2xvcn07Y29sb3I6JHt0ZXh0Q29sb3J9O1wiIGNsYXNzPVwiJHtjdXN0b21fY3NzX2NsYXNzfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7b3V0cHV0X3dpdGhfdG9rZW5zcmVwbGFjZWR9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG59O1xyXG4iXX0=