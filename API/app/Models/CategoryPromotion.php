<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryPromotion extends Model
{
    protected $fillable = [
        'category_id'
    ];

    protected $table = 'category_promotions';

    public function category(){
        return $this->belongsTo('App\Models\Category');
    }
}
